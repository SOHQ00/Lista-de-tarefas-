import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { storageService, INITIAL_TASKS } from './storageService.js';

/**
 * Converte um registro do banco de dados (snake_case) para o formato do app (camelCase)
 */
export function mapTaskFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id || null,
    title: row.title || '',
    description: row.description || '',
    category: row.category || 'GERAL',
    priority: row.priority || 'MEDIA',
    dueDate: row.due_date || '',
    completed: Boolean(row.completed),
    completedAt: row.completed_at || null,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

/**
 * Converte um objeto de tarefa do app (camelCase) para o formato do banco de dados (snake_case)
 */
export function mapTaskToDb(task, defaultUserId = null) {
  const payload = {};
  if (task.id !== undefined) payload.id = task.id;
  if (task.userId !== undefined || defaultUserId) {
    payload.user_id = task.userId || defaultUserId;
  }
  if (task.title !== undefined) payload.title = task.title.trim();
  if (task.description !== undefined) payload.description = task.description ? task.description.trim() : '';
  if (task.category !== undefined) payload.category = task.category;
  if (task.priority !== undefined) payload.priority = task.priority;
  if (task.dueDate !== undefined) payload.due_date = task.dueDate || null;
  if (task.completed !== undefined) payload.completed = Boolean(task.completed);
  if (task.completedAt !== undefined) payload.completed_at = task.completedAt;
  if (task.createdAt !== undefined) payload.created_at = task.createdAt;
  return payload;
}

export const taskService = {
  isCloudEnabled: isSupabaseConfigured,

  /**
   * Busca todas as tarefas do usuário autenticado
   */
  async getTasks(userId = null) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar tarefas do Supabase:', error);
          return storageService.getTasks(userId);
        }

        const mapped = (data || []).map(mapTaskFromDb);
        // Atualiza cache local isolado por usuário
        storageService.saveTasks(mapped, userId);
        return mapped;
      } catch (err) {
        console.error('Falha de conexão com Supabase:', err);
        return storageService.getTasks(userId);
      }
    }

    return storageService.getTasks(userId);
  },

  /**
   * Cria uma nova tarefa associada ao usuário
   */
  async createTask(taskData, userId = null) {
    const taskId = taskData.id || `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const appTask = {
      id: taskId,
      userId: userId || taskData.userId || null,
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      category: taskData.category || 'GERAL',
      priority: taskData.priority || 'MEDIA',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      completed: false,
      completedAt: null,
      createdAt: nowIso,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const dbPayload = mapTaskToDb(appTask, userId);
        const { data, error } = await supabase
          .from('tasks')
          .insert([dbPayload])
          .select()
          .single();

        if (error) {
          console.error('Erro ao inserir tarefa no Supabase:', error);
          return storageService.createTask(appTask, userId);
        }

        return mapTaskFromDb(data);
      } catch (err) {
        console.error('Falha ao conectar no Supabase ao criar tarefa:', err);
        return storageService.createTask(appTask, userId);
      }
    }

    return storageService.createTask(appTask, userId);
  },

  /**
   * Atualiza uma tarefa existente
   */
  async updateTask(id, updates, userId = null) {
    const dbUpdates = mapTaskToDb(updates, userId);

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('tasks')
          .update(dbUpdates)
          .eq('id', id);

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query.select().single();

        if (error) {
          console.error('Erro ao atualizar tarefa no Supabase:', error);
          return storageService.updateTask(id, updates, userId);
        }

        return mapTaskFromDb(data);
      } catch (err) {
        console.error('Falha ao conectar no Supabase ao atualizar tarefa:', err);
        return storageService.updateTask(id, updates, userId);
      }
    }

    return storageService.updateTask(id, updates, userId);
  },

  /**
   * Exclui uma tarefa
   */
  async deleteTask(id, userId = null) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('tasks')
          .delete()
          .eq('id', id);

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { error } = await query;

        if (error) {
          console.error('Erro ao excluir tarefa do Supabase:', error);
          return storageService.deleteTask(id, userId);
        }

        return true;
      } catch (err) {
        console.error('Falha ao conectar no Supabase ao excluir tarefa:', err);
        return storageService.deleteTask(id, userId);
      }
    }

    return storageService.deleteTask(id, userId);
  },

  /**
   * Restaura tarefas padrão de demonstração para o usuário atual
   */
  async resetToDefaults(userId = null) {
    if (isSupabaseConfigured && supabase && userId) {
      try {
        // Limpar tarefas apenas do usuário atual
        await supabase.from('tasks').delete().eq('user_id', userId);
        
        // Inserir padrões vinculados ao usuário
        const dbTasks = INITIAL_TASKS.map(t => ({
          ...mapTaskToDb(t, userId),
          user_id: userId,
          id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
        }));

        const { data, error } = await supabase
          .from('tasks')
          .insert(dbTasks)
          .select();

        if (error) {
          console.error('Erro ao restaurar tarefas no Supabase:', error);
          return storageService.resetToDefaults(userId);
        }

        const mapped = (data || []).map(mapTaskFromDb);
        storageService.saveTasks(mapped, userId);
        return mapped;
      } catch (err) {
        console.error('Falha ao conectar no Supabase ao restaurar tarefas:', err);
        return storageService.resetToDefaults(userId);
      }
    }

    return storageService.resetToDefaults(userId);
  },

  /**
   * Limpa todas as tarefas do usuário atual
   */
  async clearAllTasks(userId = null) {
    if (isSupabaseConfigured && supabase && userId) {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('user_id', userId);

        if (error) {
          console.error('Erro ao limpar tarefas no Supabase:', error);
        }
      } catch (err) {
        console.error('Falha ao conectar no Supabase ao limpar tarefas:', err);
      }
    }

    return storageService.clearAllTasks(userId);
  },

  /**
   * Inscreve-se em mudanças em tempo real do Supabase
   */
  subscribeToChanges(userId, onRefresh) {
    if (!isSupabaseConfigured || !supabase) return () => {};

    try {
      const channelName = userId ? `public:tasks:${userId}` : 'public:tasks';
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tasks' },
          (payload) => {
            // Se userId informado, valida se afeta o usuário
            if (userId && payload.new && payload.new.user_id && payload.new.user_id !== userId) {
              return;
            }
            if (onRefresh) onRefresh();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Não foi possível ativar realtime do Supabase:', e);
      return () => {};
    }
  }
};
