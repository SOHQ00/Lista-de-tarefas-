import React from 'react';
import { BarChart3, CheckCircle2, Clock, AlertTriangle, TrendingUp, Award, Layers, Target } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';
import { PRIORITIES } from '../constants/priorities';

export function AnalyticsView({ stats, tasks }) {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Tasks Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total de Tarefas</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.total}</h3>
            <p className="text-xs text-slate-400 mt-1">Registradas no sistema</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers size={24} />
          </div>
        </div>

        {/* Completed Rate Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Taxa de Conclusão</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-extrabold text-emerald-600">{stats.completionRate}%</h3>
              <span className="text-xs font-semibold text-slate-500">({stats.completedCount}/{stats.total})</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Eficiência global</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Tarefas Pendentes</p>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{stats.pendingCount}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {stats.todayCount > 0 ? `${stats.todayCount} vencem hoje` : 'Em andamento'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>

        {/* Overdue Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Tarefas Atrasadas</p>
            <h3 className="text-3xl font-extrabold text-rose-600 mt-1">{stats.overdueCount}</h3>
            <p className="text-xs text-slate-400 mt-1">Exigem atenção imediata</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
        </div>

      </div>

      {/* Charts / Progress Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Categories Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                <Target size={18} />
              </div>
              <h4 className="text-base font-bold text-slate-900">Distribuição por Categoria</h4>
            </div>
            <span className="text-xs font-semibold text-slate-500">Progresso</span>
          </div>

          <div className="space-y-4">
            {CATEGORIES.map((cat) => {
              const catStat = stats.categoryStats[cat.id] || { total: 0, completed: 0, pending: 0 };
              const percent = catStat.total > 0 ? Math.round((catStat.completed / catStat.total) * 100) : 0;
              
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                      <span className={`w-2.5 h-2.5 rounded-full ${cat.dot}`} />
                      <span>{cat.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <span>{catStat.completed}/{catStat.total} concl.</span>
                      <span className="font-bold text-slate-800">{percent}%</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: cat.accent,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <BarChart3 size={18} />
              </div>
              <h4 className="text-base font-bold text-slate-900">Volume por Prioridade</h4>
            </div>
            <span className="text-xs font-semibold text-slate-500">Status</span>
          </div>

          <div className="space-y-5">
            {PRIORITIES.map((p) => {
              const pStat = stats.priorityStats[p.id] || { total: 0, completed: 0, pending: 0 };
              const totalTasks = stats.total > 0 ? stats.total : 1;
              const sharePercent = Math.round((pStat.total / totalTasks) * 100);

              return (
                <div key={p.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <span className={`w-2.5 h-2.5 rounded-full ${p.dot}`} />
                      <span>Prioridade {p.label}</span>
                    </div>
                    <span className="font-semibold text-slate-600">{pStat.total} tarefas ({sharePercent}%)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center justify-between px-2.5 py-1 bg-white rounded-lg border border-slate-200/60">
                      <span>Pendentes:</span>
                      <span className="font-bold text-amber-600">{pStat.pending}</span>
                    </div>
                    <div className="flex items-center justify-between px-2.5 py-1 bg-white rounded-lg border border-slate-200/60">
                      <span>Concluídas:</span>
                      <span className="font-bold text-emerald-600">{pStat.completed}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Productivity Insight Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-100">
            <Award size={16} /> Insights de Produtividade
          </div>
          <h4 className="text-base sm:text-lg font-bold">
            {stats.completionRate >= 70
              ? 'Excelente ritmo! Você está quase zerando suas pendências.'
              : stats.completionRate >= 30
              ? 'Bom progresso! Foque nas tarefas de alta prioridade para acelerar.'
              : 'Comece pelas tarefas mais simples para ganhar tração e impulso.'}
          </h4>
          <p className="text-xs text-brand-100/90">
            Dica: Divida tarefas grandes em passos menores para manter o foco constante.
          </p>
        </div>
      </div>

    </div>
  );
}
