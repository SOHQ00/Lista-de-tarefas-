import React from 'react';
import { AlertTriangle, Trash2, LogOut, X } from 'lucide-react';

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger', // 'danger' | 'warning' | 'primary'
}) {
  if (!isOpen) return null;

  const renderIcon = () => {
    if (variant === 'danger') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <Trash2 size={20} />
        </div>
      );
    }
    if (variant === 'warning') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <LogOut size={20} />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
        <AlertTriangle size={20} />
      </div>
    );
  };

  const confirmBtnStyles = {
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          {renderIcon()}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 font-sans">{title}</h3>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            id="btn-confirm-action"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 ${
              confirmBtnStyles[variant] || confirmBtnStyles.danger
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
