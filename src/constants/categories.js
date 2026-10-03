export const CATEGORIES = [
  {
    id: 'TRABALHO',
    label: 'Trabalho',
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    badge: 'bg-blue-500/10 text-blue-700 border-blue-200/80',
    accent: '#3B82F6',
    dot: 'bg-blue-500',
  },
  {
    id: 'PESSOAL',
    label: 'Pessoal',
    color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    badge: 'bg-purple-500/10 text-purple-700 border-purple-200/80',
    accent: '#A855F7',
    dot: 'bg-purple-500',
  },
  {
    id: 'ESTUDO',
    label: 'Estudos',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/80',
    accent: '#10B981',
    dot: 'bg-emerald-500',
  },
  {
    id: 'SAUDE',
    label: 'Saúde',
    color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    badge: 'bg-rose-500/10 text-rose-700 border-rose-200/80',
    accent: '#F43F5E',
    dot: 'bg-rose-500',
  },
  {
    id: 'FINANCAS',
    label: 'Finanças',
    color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    badge: 'bg-amber-500/10 text-amber-700 border-amber-200/80',
    accent: '#F59E0B',
    dot: 'bg-amber-500',
  },
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || {
    id: 'GERAL',
    label: id || 'Geral',
    color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
    badge: 'bg-slate-500/10 text-slate-700 border-slate-200',
    accent: '#64748B',
    dot: 'bg-slate-400',
  };
};
