import React from 'react';
import { TaskItem } from './TaskItem';
import { CheckCircle2, Inbox, Plus, Sparkles, SearchX } from 'lucide-react';

export function TaskList({ tasks, onToggle, onEdit, onDelete, onOpenNewTask, filter, searchQuery }) {
  if (tasks.length === 0) {
    // Empty state when searching
    if (searchQuery) {
      return (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <SearchX size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">Nenhuma tarefa encontrada</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Não encontramos nenhuma tarefa correspondente ao termo "{searchQuery}".
          </p>
        </div>
      );
    }

    // Empty state when filtered by completed
    if (filter === 'completed') {
      return (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
            <Inbox size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">Nenhuma tarefa concluída ainda</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Marque tarefas pendentes como concluídas para acompanhar seu histórico aqui.
          </p>
        </div>
      );
    }

    // Default empty state
    return (
      <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300 shadow-xs animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4 shadow-sm shadow-brand-500/10">
          <Sparkles size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 font-sans">Tudo limpo por aqui!</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          Você não possui tarefas pendentes no momento. Que tal começar adicionando uma nova?
        </p>
        <button
          onClick={onOpenNewTask}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-xl shadow-sm hover:shadow-md hover:shadow-brand-500/20 transition-all"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Criar primeira tarefa</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
