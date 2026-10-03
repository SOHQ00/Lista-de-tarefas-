import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Clock, Plus } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { PriorityBadge } from './PriorityBadge';

export function CalendarView({ tasks, onToggle, onEdit, onDelete, onOpenNewTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  // Generate calendar days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDaysInMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevDaysInMonth - i;
    const dateStr = new Date(year, month - 1, d).toISOString().split('T')[0];
    calendarDays.push({ dayNumber: d, dateStr, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    // Format YYYY-MM-DD
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    calendarDays.push({ dayNumber: d, dateStr, isCurrentMonth: true });
  }

  // Next month leading days to complete grid (up to 35 or 42)
  const remainingCells = 42 - calendarDays.length;
  for (let d = 1; d <= remainingCells; d++) {
    const dateStr = new Date(year, month + 1, d).toISOString().split('T')[0];
    calendarDays.push({ dayNumber: d, dateStr, isCurrentMonth: false });
  }

  // Filter tasks for selected date
  const tasksForSelectedDate = tasks.filter(t => t.dueDate === selectedDate);

  const formattedSelectedDate = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full'
  }).format(new Date(selectedDate + 'T12:00:00'));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* Calendar Grid Container */}
      <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        
        {/* Calendar Navigation Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-sans">
              {monthNames[month]} <span className="text-brand-600">{year}</span>
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
            >
              Hoje
            </button>
            <button
              onClick={prevMonth}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Mês anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Próximo mês"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          {daysOfWeek.map((dow, idx) => (
            <div key={idx} className="py-1">{dow}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {calendarDays.map((item, idx) => {
            const dayTasks = tasks.filter(t => t.dueDate === item.dateStr);
            const isSelected = item.dateStr === selectedDate;
            const todayStr = new Date().toISOString().split('T')[0];
            const isToday = item.dateStr === todayStr;

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(item.dateStr)}
                className={`min-h-[52px] sm:min-h-[60px] p-1 sm:p-1.5 rounded-xl flex flex-col justify-between items-center transition-all duration-150 border ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-500/30'
                    : isToday
                    ? 'bg-brand-50/70 border-brand-300 text-brand-900 font-bold'
                    : item.isCurrentMonth
                    ? 'bg-white hover:bg-slate-50 border-slate-100 text-slate-800'
                    : 'bg-slate-50/50 border-transparent text-slate-300'
                }`}
              >
                <span className={`text-xs font-semibold ${isSelected ? 'text-white' : ''}`}>
                  {item.dayNumber}
                </span>

                {/* Indicators for tasks */}
                {dayTasks.length > 0 && (
                  <div className="flex items-center gap-1 justify-center flex-wrap max-w-full">
                    {dayTasks.slice(0, 3).map((t) => (
                      <span
                        key={t.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected
                            ? 'bg-white'
                            : t.completed
                            ? 'bg-emerald-400'
                            : t.priority === 'ALTA'
                            ? 'bg-rose-500'
                            : 'bg-brand-500'
                        }`}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <span className={`text-[9px] font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        +{dayTasks.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Selected Day Task List Container */}
      <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div>
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tarefas do Dia</p>
              <h4 className="text-base font-bold text-slate-900 capitalize mt-0.5">
                {formattedSelectedDate}
              </h4>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-full">
              {tasksForSelectedDate.length} tarefa{tasksForSelectedDate.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* List of Tasks for this Day */}
          {tasksForSelectedDate.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <CalendarIcon size={24} />
              </div>
              <p className="text-sm font-semibold text-slate-700">Nenhuma tarefa agendada</p>
              <p className="text-xs text-slate-400 mt-1">
                Aproveite o dia livre ou adicione uma nova atividade para esta data.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {tasksForSelectedDate.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200/60 opacity-60'
                      : 'bg-white border-slate-200 hover:border-brand-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggle(task.id)}
                        className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <CategoryBadge categoryId={task.category} size="sm" />
                          <PriorityBadge priorityId={task.priority} size="sm" showIcon={false} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Bottom CTA to add task for this day */}
        <div className="pt-4 border-t border-slate-100 mt-4">
          <button
            onClick={() => onOpenNewTask(selectedDate)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Adicionar tarefa para esta data</span>
          </button>
        </div>

      </div>

    </div>
  );
}
