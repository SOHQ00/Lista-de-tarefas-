import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useTasks } from './hooks/useTasks';
import { Navbar } from './components/Navbar';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { ConfirmModal } from './components/ConfirmModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthView } from './components/Auth/AuthView';
import { Plus, Loader2, CheckSquare, Sparkles } from 'lucide-react';

export function App() {
  const { user, profile, isAuthenticated, isLoading: isAuthLoading, isPasswordRecovery } = useAuth();

  // Se não estiver autenticado ou em recuperação de senha, exibe a tela de Login / Recuperação
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/25 mb-4 animate-bounce">
          <CheckSquare className="w-8 h-8 stroke-[2.5]" />
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
          <span>Verificando sessão no Supabase...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || isPasswordRecovery) {
    return <AuthView />;
  }

  return <AuthenticatedApp user={user} profile={profile} />;
}

// Aplicação principal após o usuário estar autenticado
function AuthenticatedApp({ user, profile }) {
  const {
    tasks,
    filteredTasks,
    stats,
    isLoading,
    isSyncing,
    isCloudEnabled,
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
  } = useTasks(user?.id);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    variant: 'danger',
    onConfirm: () => {},
  });

  const firstName = (profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário').split(' ')[0];

  const handleOpenNewTask = (initialDueDate = null) => {
    setEditingTask(initialDueDate ? { dueDate: initialDueDate } : null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      updateTask(taskData.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleDeleteTask = (id, title) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Tarefa',
      message: `Tem certeza que deseja excluir a tarefa "${title}"? A tarefa será removida do seu perfil no Supabase.`,
      confirmLabel: 'Excluir',
      variant: 'danger',
      onConfirm: () => deleteTask(id),
    });
  };

  const handleOpenResetModal = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Restaurar Tarefas Padrão',
      message: 'Deseja recriar as tarefas de demonstração no seu perfil do Supabase?',
      confirmLabel: 'Restaurar Tarefas',
      cancelLabel: 'Cancelar',
      variant: 'warning',
      onConfirm: () => {
        resetToDefaultTasks();
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-brand-500 selection:text-white">
      
      {/* Top Navbar com perfil do usuário */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNewTask={() => handleOpenNewTask()}
        onOpenLogoutModal={handleOpenResetModal}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        pendingCount={stats.pendingCount}
        isCloudEnabled={isCloudEnabled}
        isSyncing={isSyncing}
        onRefresh={() => loadTasks(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Dynamic Header Banner */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-100">
                Olá, {firstName}! 👋
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              {activeTab === 'tasks' && 'Minhas Tarefas'}
              {activeTab === 'analytics' && 'Dashboard de Produtividade'}
              {activeTab === 'calendar' && 'Calendário de Atividades'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {activeTab === 'tasks' && 'Suas tarefas individuais seguras no Supabase com isolamento de perfil.'}
              {activeTab === 'analytics' && 'Acompanhe seu progresso, taxas de conclusão e métricas de desempenho.'}
              {activeTab === 'calendar' && 'Visualize suas entregas organizadas por data de vencimento.'}
            </p>
          </div>

          {/* Quick Stats Pill on top right */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{stats.completedCount} de {stats.total} concluídas</span>
              <span className="text-slate-300">|</span>
              <span className="text-brand-600 font-bold">{stats.completionRate}%</span>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-brand-600 font-semibold text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
              <span>Sincronizando tarefas com Supabase...</span>
            </div>
          </div>
        )}

        {/* Tab 1: Tasks View */}
        {!isLoading && activeTab === 'tasks' && (
          <div className="space-y-6">
            
            {/* Filters Bar */}
            <TaskFilters
              filter={filter}
              onFilterChange={setFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              stats={stats}
            />

            {/* Task Items List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>
                  {filteredTasks.length} {filteredTasks.length === 1 ? 'tarefa listada' : 'tarefas listadas'}
                </span>
                {filter === 'all' && stats.completedCount > 0 && (
                  <span className="text-emerald-600">
                    {stats.completedCount} concluída{stats.completedCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <TaskList
                tasks={filteredTasks}
                onToggle={toggleTaskCompletion}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onOpenNewTask={() => handleOpenNewTask()}
                filter={filter}
                searchQuery={searchQuery}
              />
            </div>

          </div>
        )}

        {/* Tab 2: Analytics View */}
        {!isLoading && activeTab === 'analytics' && (
          <AnalyticsView stats={stats} tasks={tasks} />
        )}

        {/* Tab 3: Calendar View */}
        {!isLoading && activeTab === 'calendar' && (
          <CalendarView
            tasks={tasks}
            onToggle={toggleTaskCompletion}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onOpenNewTask={handleOpenNewTask}
          />
        )}

      </main>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <button
          onClick={() => handleOpenNewTask()}
          className="w-14 h-14 rounded-full bg-brand-600 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center active:scale-95 transition-all"
          aria-label="Nova Tarefa"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </div>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        cancelLabel={confirmModal.cancelLabel}
        variant={confirmModal.variant}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        stats={stats}
      />

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200/60 bg-white/60 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} TaskFlow • Conectado ao Supabase com Autenticação e RLS</p>
          <p className="flex items-center gap-1">
            Conectado como <strong className="text-slate-600">{user?.email}</strong>
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
