import React, { useState } from 'react';
import { Calendar, Trash2, Edit3, Check, ChevronDown, ChevronUp, AlertCircle, Clock } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { PriorityBadge } from './PriorityBadge';

export function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format date and determine status (overdue, today, future)
  const getDateStatus = (dueDateStr) => {
    if (!dueDateStr) return { label: 'Sem data', isOverdue: false, isToday: false };
    
    // Parse safely
    const [year, month, day] = dueDateStr.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = dueDate.getTime() === today.getTime();
    const isOverdue = dueDate.getTime() < today.getTime() && !task.completed;

    const formatted = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: dueDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    }).format(dueDate);

    return {
      label: isToday ? 'Hoje' : formatted,
      isOverdue,
      isToday,
    };
  };

  const dateInfo = getDateStatus(task.dueDate);

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 bg-white ${
        task.completed
          ? 'border-slate-200/60 bg-slate-50/50 opacity-65'
          : dateInfo.isOverdue
          ? 'border-rose-200 hover:border-rose-300 hover:shadow-card shadow-xs'
          : 'border-slate-200/90 hover:border-brand-300 hover:shadow-card shadow-xs'
      }`}
    >
      <div className="p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4">
        
        {/* Custom Checkbox */}
        <button
          type="button"
          id={`task-check-${task.id}`}
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
          className={`mt-0.5 relative flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs scale-100'
              : 'border-slate-300 hover:border-brand-500 bg-white hover:bg-brand-50/50'
          }`}
        >
          {task.completed && (
            <Check size={15} strokeWidth={3} className="animate-pop text-white" />
          )}
        </button>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          
          {/* Header row: Category & Priority Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <CategoryBadge categoryId={task.category} size="sm" />
            <PriorityBadge priorityId={task.priority} size="sm" />

            {/* Date Tag with Calendar Icon */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  task.completed
                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                    : dateInfo.isOverdue
                    ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                    : dateInfo.isToday
                    ? 'bg-amber-50 text-amber-700 border-amber-200 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
                title={dateInfo.isOverdue ? 'Tarefa atrasada!' : undefined}
              >
                {dateInfo.isOverdue ? (
                  <AlertCircle size={12} className="text-rose-500" />
                ) : (
                  <Calendar size={12} className="text-slate-400" />
                )}
                <span>{dateInfo.label}</span>
              </span>
            )}
          </div>

          {/* Title with strike-through when completed */}
          <h3
            onClick={() => onToggle(task.id)}
            className={`text-base font-semibold leading-snug cursor-pointer transition-colors duration-150 select-none ${
              task.completed
                ? 'line-through text-slate-400 decoration-slate-400 decoration-2'
                : 'text-slate-900 hover:text-brand-600'
            }`}
          >
            {task.title}
          </h3>

          {/* Description (collapsible / readable) */}
          {task.description && (
            <div className="mt-1.5">
              <p
                className={`text-sm leading-relaxed text-slate-600 transition-all ${
                  !isExpanded ? 'line-clamp-1' : ''
                } ${task.completed ? 'text-slate-400 line-through' : ''}`}
              >
                {task.description}
              </p>
              {task.description.length > 80 && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline"
                >
                  {isExpanded ? (
                    <>
                      <span>Ver menos</span>
                      <ChevronUp size={13} />
                    </>
                  ) : (
                    <>
                      <span>Ver mais</span>
                      <ChevronDown size={13} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: Edit and Trash */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            type="button"
            id={`task-edit-${task.id}`}
            onClick={() => onEdit(task)}
            title="Editar tarefa"
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
          >
            <Edit3 size={16} />
          </button>

          <button
            type="button"
            id={`task-delete-${task.id}`}
            onClick={() => onDelete(task.id, task.title)}
            title="Excluir tarefa"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
