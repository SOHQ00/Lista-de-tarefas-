import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertTriangle, Check, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';
import { PRIORITIES } from '../constants/priorities';

export function TaskModal({ isOpen, onClose, onSave, editingTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('TRABALHO');
  const [priority, setPriority] = useState('MEDIA');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setCategory(editingTask.category || 'TRABALHO');
      setPriority(editingTask.priority || 'MEDIA');
      setDueDate(editingTask.dueDate || new Date().toISOString().split('T')[0]);
    } else {
      // Default new task values
      setTitle('');
      setDescription('');
      setCategory('TRABALHO');
      setPriority('MEDIA');
      setDueDate(new Date().toISOString().split('T')[0]);
    }
    setError('');
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('O título da tarefa é obrigatório.');
      return;
    }

    onSave({
      ...(editingTask ? { id: editingTask.id } : {}),
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate,
    });

    onClose();
  };

  const setShortcutDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDueDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-sans">
              {editingTask ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Title input */}
          <div>
            <label htmlFor="task-title-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Título da Tarefa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="task-title-input"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ex: Concluir apresentação para o cliente..."
              autoFocus
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all font-medium"
            />
            {error && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertTriangle size={13} /> {error}
              </p>
            )}
          </div>

          {/* Description input */}
          <div>
            <label htmlFor="task-desc-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Descrição / Detalhes (Opcional)
            </label>
            <textarea
              id="task-desc-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione notas, links ou requisitos adicionais..."
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Tag size={13} className="text-slate-400" /> Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                      isSelected
                        ? `${cat.color} ring-2 ring-brand-500/30 font-bold shadow-xs scale-102`
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
                    {cat.label}
                    {isSelected && <Check size={13} className="ml-0.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Priority Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Prioridade
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {PRIORITIES.map((p) => {
                  const isSelected = priority === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPriority(p.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                        isSelected
                          ? `${p.badge} ring-2 ring-brand-500/30 shadow-xs`
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="task-due-date" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" /> Data de Vencimento
              </label>
              <input
                type="date"
                id="task-due-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium cursor-pointer"
              />
              <div className="mt-1.5 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setShortcutDate(0)}
                  className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => setShortcutDate(1)}
                  className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md"
                >
                  Amanhã
                </button>
                <button
                  type="button"
                  onClick={() => setShortcutDate(7)}
                  className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md"
                >
                  +7 dias
                </button>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-save-task"
              className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-98 rounded-xl shadow-sm hover:shadow-md hover:shadow-brand-500/20 transition-all"
            >
              {editingTask ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
