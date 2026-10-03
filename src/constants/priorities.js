export const PRIORITIES = [
  {
    id: 'ALTA',
    label: 'Alta',
    order: 1,
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
    iconColor: 'text-rose-600',
    bgLight: 'bg-rose-50/60',
  },
  {
    id: 'MEDIA',
    label: 'Média',
    order: 2,
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500',
    iconColor: 'text-amber-600',
    bgLight: 'bg-amber-50/60',
  },
  {
    id: 'BAIXA',
    label: 'Baixa',
    order: 3,
    badge: 'bg-slate-100 text-slate-700 border-slate-200/80',
    dot: 'bg-slate-400',
    iconColor: 'text-slate-500',
    bgLight: 'bg-slate-50/60',
  },
];

export const getPriorityById = (id) => {
  return PRIORITIES.find(p => p.id === id) || PRIORITIES[1]; // default Media
};
