import React from 'react';
import { Search, X, SlidersHorizontal, CheckCircle2, Circle, ListFilter } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';
import { PRIORITIES } from '../constants/priorities';

export function TaskFilters({
  filter,
  onFilterChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  searchQuery,
  onSearchChange,
  stats,
}) {
  const statusFilters = [
    { id: 'all', label: 'Todas', count: stats.total, icon: ListFilter },
    { id: 'pending', label: 'Pendentes', count: stats.pendingCount, icon: Circle },
    { id: 'completed', label: 'Concluídas', count: stats.completedCount, icon: CheckCircle2 },
  ];

  const hasActiveFilters = categoryFilter !== 'all' || priorityFilter !== 'all' || searchQuery !== '';

  const clearFilters = () => {
    onCategoryChange('all');
    onPriorityChange('all');
    onSearchChange('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
      
      {/* Top Bar: Search and Status Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        
        {/* Status Filters (Todas, Pendentes, Concluídas) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl overflow-x-auto">
          {statusFilters.map((tab) => {
            const Icon = tab.icon;
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-status-${tab.id}`}
                onClick={() => onFilterChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-brand-600' : 'text-slate-400'} />
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-bold transition-all ${
                    isActive ? 'bg-brand-100 text-brand-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 md:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            id="input-search-tasks"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
        </div>

      </div>

      {/* Secondary Row: Category and Priority Selectors */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <SlidersHorizontal size={13} /> Filtrar por:
          </span>

          {/* Category Dropdown */}
          <select
            id="select-category-filter"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-750 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
          >
            <option value="all">Todas Categorias</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            id="select-priority-filter"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-750 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
          >
            <option value="all">Todas Prioridades</option>
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <X size={13} />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>

        {/* Quick Alert Tags */}
        <div className="flex items-center gap-3 text-slate-500">
          {stats.overdueCount > 0 && (
            <span className="inline-flex items-center gap-1 font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              {stats.overdueCount} atrasada{stats.overdueCount > 1 ? 's' : ''}
            </span>
          )}
          {stats.todayCount > 0 && (
            <span className="inline-flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {stats.todayCount} para hoje
            </span>
          )}
        </div>

      </div>

    </div>
  );
}
