import React, { useState } from 'react';
import { CheckSquare, BarChart3, Calendar, LogOut, Menu, X, Plus, Sparkles, Database, Cloud, RefreshCw } from 'lucide-react';

export function Navbar({
  activeTab,
  onTabChange,
  onOpenNewTask,
  onOpenLogoutModal,
  pendingCount,
  isCloudEnabled = true,
  isSyncing = false,
  onRefresh
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'analytics', label: 'Análises', icon: BarChart3 },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <CheckSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight font-sans">TaskFlow</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                  <Sparkles size={10} className="mr-1 text-brand-500" /> Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Gestão inteligente com Supabase</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-brand-700 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-brand-600' : 'text-slate-400'} />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`ml-0.5 px-1.5 py-0.5 text-xs rounded-full font-bold transition-all ${
                      isActive ? 'bg-brand-100 text-brand-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Supabase Status Pill */}
            <div
              title={isCloudEnabled ? 'Sincronização em tempo real ativa no Supabase (projeto: lista-tarefas)' : 'Modo Offline (LocalStorage)'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isCloudEnabled
                  ? 'bg-emerald-50/80 border-emerald-200/80 text-emerald-800 shadow-2xs'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span className={`w-2 h-2 rounded-full ${isCloudEnabled ? 'bg-emerald-500' : 'bg-slate-400'} ${isSyncing ? 'animate-ping' : ''}`} />
              </div>
              <Database size={13} className={isCloudEnabled ? 'text-emerald-600' : 'text-slate-400'} />
              <span>{isCloudEnabled ? 'Supabase' : 'Offline'}</span>
              {isSyncing && (
                <RefreshCw size={11} className="animate-spin text-emerald-600 ml-0.5" />
              )}
            </div>

            {/* Nova Tarefa CTA */}
            <button
              id="btn-new-task-nav"
              onClick={onOpenNewTask}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-xl shadow-sm hover:shadow-md hover:shadow-brand-500/20 transition-all duration-150"
            >
              <Plus size={17} strokeWidth={2.5} />
              <span>Nova Tarefa</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            {/* Logout / Reset Button */}
            <button
              id="btn-logout"
              onClick={onOpenLogoutModal}
              title="Sair / Redefinir sessão"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-150"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            {isCloudEnabled && (
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" title="Supabase Online" />
            )}
            <button
              onClick={onOpenNewTask}
              className="p-2 text-white bg-brand-600 rounded-lg shadow-sm"
              title="Nova Tarefa"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2 shadow-lg animate-fade-in">
          
          <div className="px-3 py-2 bg-emerald-50 rounded-lg flex items-center justify-between text-xs font-semibold text-emerald-800 mb-2 border border-emerald-100">
            <span className="flex items-center gap-1.5">
              <Database size={14} className="text-emerald-600" />
              Supabase Nuvem: Ativo
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={18} className={isActive ? 'text-brand-600' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-brand-100 text-brand-800 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogoutModal();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              <LogOut size={18} />
              <span>Sair / Redefinir</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
