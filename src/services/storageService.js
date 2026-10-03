const STORAGE_KEY = 'taskflow_tasks_v1';

// Helper to format ISO date strings for today / tomorrow / upcoming
const getRelativeDateStr = (daysOffset) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Finalizar relatório de métricas do projeto',
    description: 'Revisar os KPIs trimestrais e consolidar apresentação para a diretoria.',
    category: 'TRABALHO',
    priority: 'ALTA',
    dueDate: getRelativeDateStr(0), // Hoje
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Estudar arquitetura de microfrontends e Supabase',
    description: 'Ler documentação oficial e testar autenticação e Row Level Security.',
    category: 'ESTUDO',
    priority: 'MEDIA',
    dueDate: getRelativeDateStr(1), // Amanhã
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Consulta médica de rotina e exames laboratoriais',
    description: 'Agendado para o período da manhã.',
    category: 'SAUDE',
    priority: 'MEDIA',
    dueDate: getRelativeDateStr(3),
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Organizar planilha de orçamento mensal',
    description: 'Categorizar despesas fixas e variáveis e planejar reserva de emergência.',
    category: 'FINANCAS',
    priority: 'BAIXA',
    dueDate: getRelativeDateStr(5),
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Comprar presentes de aniversário da família',
    description: 'Pesquisar opções online com entrega expressa.',
    category: 'PESSOAL',
    priority: 'BAIXA',
    dueDate: getRelativeDateStr(-1), // Atrasada para teste de badge
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 'task-6',
    title: 'Definir escopo do novo módulo de relatórios',
    description: 'Alinhamento com stakeholders de produto e design.',
    category: 'TRABALHO',
    priority: 'ALTA',
    dueDate: getRelativeDateStr(-2),
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
  }
];

export const storageService = {
  getTasks: () => {
    try {
      if (typeof localStorage === 'undefined') return INITIAL_TASKS;
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
        return INITIAL_TASKS;
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Erro ao ler tarefas do LocalStorage:', err);
      return INITIAL_TASKS;
    }
  },

  saveTasks: (tasks) => {
    try {
      if (typeof localStorage === 'undefined') return false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (err) {
      console.error('Erro ao salvar tarefas no LocalStorage:', err);
      return false;
    }
  },

  createTask: (newTask) => {
    const tasks = storageService.getTasks();
    const task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      completed: false,
      ...newTask,
    };
    const updated = [task, ...tasks];
    storageService.saveTasks(updated);
    return task;
  },

  updateTask: (id, updates) => {
    const tasks = storageService.getTasks();
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          ...updates,
          completedAt: updates.completed !== undefined 
            ? (updates.completed ? (t.completedAt || new Date().toISOString()) : null)
            : t.completedAt
        };
      }
      return t;
    });
    storageService.saveTasks(updated);
    return updated.find((t) => t.id === id);
  },

  deleteTask: (id) => {
    const tasks = storageService.getTasks();
    const updated = tasks.filter((t) => t.id !== id);
    storageService.saveTasks(updated);
    return true;
  },

  resetToDefaults: () => {
    storageService.saveTasks(INITIAL_TASKS);
    return INITIAL_TASKS;
  },

  clearAllTasks: () => {
    storageService.saveTasks([]);
    return [];
  }
};
