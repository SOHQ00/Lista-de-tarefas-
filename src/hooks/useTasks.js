import { useState, useEffect, useMemo, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';

export function useTasks(userId = null) {
  // Inicializa com dados locais isolados pelo userId
  const [tasks, setTasks] = useState(() => storageService.getTasks(userId));
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'analytics' | 'calendar'

  // Carregar tarefas do Supabase no início ou quando userId mudar
  const loadTasks = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await taskService.getTasks(userId);
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err);
    } finally {
      if (showLoading) setIsLoading(false);
      setIsSyncing(false);
    }
  }, [userId]);

  useEffect(() => {
    loadTasks(true);

    // Configurar escuta em tempo real do Supabase
    const unsubscribe = taskService.subscribeToChanges(userId, () => {
      loadTasks(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [loadTasks, userId]);

  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3B82F6', '#10B981', '#A855F7', '#F59E0B']
      });
    } catch (e) {
      // Confetti opcional
    }
  }, []);

  // Adicionar tarefa (Atualização otimista + Supabase)
  const addTask = useCallback(async (taskData) => {
    const tempId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const optimisticTask = {
      id: tempId,
      userId,
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      category: taskData.category || 'GERAL',
      priority: taskData.priority || 'MEDIA',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };

    // Atualização otimista imediata na UI
    setTasks(prev => [optimisticTask, ...prev]);
    setIsSyncing(true);

    try {
      const created = await taskService.createTask(optimisticTask, userId);
      if (created) {
        setTasks(prev => prev.map(t => (t.id === tempId ? created : t)));
      }
    } catch (err) {
      console.error('Erro ao salvar no Supabase:', err);
    } finally {
      setIsSyncing(false);
    }

    return optimisticTask;
  }, [userId]);

  // Atualizar tarefa (Atualização otimista + Supabase)
  const updateTask = useCallback(async (id, updates) => {
    let celebrationTriggered = false;

    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const isMarkingCompleted = updates.completed !== undefined && updates.completed && !t.completed;
          if (isMarkingCompleted && !celebrationTriggered) {
            triggerCelebration();
            celebrationTriggered = true;
          }
          return {
            ...t,
            ...updates,
            completedAt: updates.completed !== undefined
              ? (updates.completed ? (t.completedAt || new Date().toISOString()) : null)
              : t.completedAt,
          };
        }
        return t;
      })
    );

    setIsSyncing(true);
    try {
      await taskService.updateTask(id, updates, userId);
    } catch (err) {
      console.error('Erro ao atualizar no Supabase:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [userId, triggerCelebration]);

  // Alternar conclusão
  const toggleTaskCompletion = useCallback(async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const willBeCompleted = !task.completed;
    if (willBeCompleted) {
      triggerCelebration();
    }

    const updates = {
      completed: willBeCompleted,
      completedAt: willBeCompleted ? new Date().toISOString() : null
    };

    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );

    setIsSyncing(true);
    try {
      await taskService.updateTask(id, updates, userId);
    } catch (err) {
      console.error('Erro ao atualizar status no Supabase:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [tasks, userId, triggerCelebration]);

  // Excluir tarefa (Otimista + Supabase)
  const deleteTask = useCallback(async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setIsSyncing(true);
    try {
      await taskService.deleteTask(id, userId);
    } catch (err) {
      console.error('Erro ao excluir no Supabase:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [userId]);

  // Restaurar dados padrão de demonstração para este usuário
  const resetToDefaultTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const defaults = await taskService.resetToDefaults(userId);
      setTasks(defaults);
    } catch (err) {
      console.error('Erro ao restaurar tarefas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Limpar todas as tarefas do usuário
  const clearAllTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      await taskService.clearAllTasks(userId);
      setTasks([]);
    } catch (err) {
      console.error('Erro ao limpar tarefas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Tarefas filtradas e ordenadas
  const filteredTasks = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const query = searchQuery.toLowerCase().trim();

    return tasks
      .filter(task => {
        // Filtro de status
        if (filter === 'pending' && task.completed) return false;
        if (filter === 'completed' && !task.completed) return false;

        // Filtro de categoria
        if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

        // Filtro de prioridade
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // Busca por texto
        if (query) {
          const titleMatch = task.title?.toLowerCase().includes(query);
          const descMatch = task.description?.toLowerCase().includes(query);
          if (!titleMatch && !descMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Não concluídas primeiro, concluídas por último
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        // Atrasadas primeiro se não concluídas
        if (!a.completed && !b.completed) {
          const aOverdue = a.dueDate && a.dueDate < todayStr;
          const bOverdue = b.dueDate && b.dueDate < todayStr;
          if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
        }

        // Data de vencimento crescente
        if (a.dueDate && b.dueDate) {
          if (a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        }

        // Data de criação decrescente
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [tasks, filter, categoryFilter, priorityFilter, searchQuery]);

  // Estatísticas
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const total = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = total - completedCount;
    const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    
    const overdueCount = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr).length;
    const todayCount = tasks.filter(t => !t.completed && t.dueDate === todayStr).length;

    // Estatísticas por categoria
    const categoryStats = {};
    tasks.forEach(t => {
      const cat = t.category || 'GERAL';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, completed: 0, pending: 0 };
      }
      categoryStats[cat].total += 1;
      if (t.completed) categoryStats[cat].completed += 1;
      else categoryStats[cat].pending += 1;
    });

    // Estatísticas por prioridade
    const priorityStats = {
      ALTA: { total: 0, completed: 0, pending: 0 },
      MEDIA: { total: 0, completed: 0, pending: 0 },
      BAIXA: { total: 0, completed: 0, pending: 0 },
    };
    tasks.forEach(t => {
      const p = t.priority || 'MEDIA';
      if (priorityStats[p]) {
        priorityStats[p].total += 1;
        if (t.completed) priorityStats[p].completed += 1;
        else priorityStats[p].pending += 1;
      }
    });

    return {
      total,
      completedCount,
      pendingCount,
      completionRate,
      overdueCount,
      todayCount,
      categoryStats,
      priorityStats,
    };
  }, [tasks]);

  return {
    tasks,
    filteredTasks,
    stats,
    isLoading,
    isSyncing,
    isCloudEnabled: taskService.isCloudEnabled,
    filter,
    setFilter,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    resetToDefaultTasks,
    clearAllTasks,
  };
}
