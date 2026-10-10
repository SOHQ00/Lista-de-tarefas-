import React, { useState } from 'react';
import {
  CheckSquare,
  BarChart3,
  Calendar,
  LogOut,
  Menu,
  X,
  Plus,
  Sparkles,
  Database,
  RefreshCw,
  User,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar({
  activeTab,
  onTabChange,
  onOpenNewTask,
  onOpenLogoutModal,
  onOpenProfileModal,
  pendingCount,
  isCloudEnabled = true,
  isSyncing = false,
  onRefresh
}) {
  const { user, profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'analytics', label: 'Análises', icon: BarChart3 },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const displayEmail = user?.email || '';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('') || 'U';

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
                  <Sparkles size={10} className="mr-1 text-brand-500" /> Supabase
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Gestão de tarefas com autenticação</p>
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
              title={isCloudEnabled ? 'Sincronização com Supabase (RLS ativo para seu usuário)' : 'Modo Offline'}
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

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-2xl hover:bg-slate-100/80 border border-slate-200/70 transition-all duration-150 group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {initials}
                </div>
                <div className="text-left hidden lg:block max-w-[120px]">
                  <div className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate leading-tight">
                    {displayEmail}
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-transform duration-150" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-scale-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900 truncate">{displayName}</div>
                      <div className="text-[11px] text-slate-500 truncate">{displayEmail}</div>
                    </div>

                    <button
                      id="dropdown-open-profile"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfileModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600 flex items-center gap-2"
                    >
                      <User size={15} />
                      <span>Meu Perfil</span>
                    </button>

                    <button
                      id="dropdown-reset-data"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenLogoutModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <RefreshCw size={15} />
                      <span>Restaurar Tarefas Demo</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      id="dropdown-logout"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut size={15} />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenProfileModal}
              className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold shadow-xs"
              title="Meu Perfil"
            >
              {initials}
            </button>
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
          
          {/* User Info Bar */}
          <div
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenProfileModal();
            }}
            className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200/60 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{displayName}</div>
                <div className="text-[11px] text-slate-500 truncate">{displayEmail}</div>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-brand-600">Ver Perfil</span>
          </div>

          {/* Cloud Status */}
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

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogoutModal();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              <span>Restaurar Tarefas Demo</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-bold text-rose-600 hover:bg-rose-50"
            >
              <LogOut size={18} />
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
