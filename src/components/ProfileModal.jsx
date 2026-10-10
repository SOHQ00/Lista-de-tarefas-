import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  User,
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  Clock,
  Sparkles,
  Save,
  LogOut,
  KeyRound,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';

export function ProfileModal({ isOpen, onClose, stats = {} }) {
  const { user, profile, updateProfile, resetPassword, logout } = useAuth();

  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(profile?.full_name || user?.user_metadata?.full_name || '');
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [isOpen, profile, user]);

  if (!isOpen) return null;

  const userEmail = user?.email || profile?.email || 'usuario@exemplo.com';
  const displayName = name || profile?.full_name || userEmail.split('@')[0];
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('') || 'U';

  const createdDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : 'Recentemente';

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('O nome não pode estar em branco.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await updateProfile({ fullName: name.trim() });
      setSuccessMsg('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setErrorMsg('Não foi possível salvar as alterações no Supabase.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestPasswordReset = async () => {
    if (!userEmail) return;
    setIsSendingReset(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await resetPassword(userEmail);
      setSuccessMsg(`Link de redefinição enviado para ${userEmail}.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Erro ao enviar e-mail de recuperação:', err);
      setErrorMsg('Falha ao enviar e-mail de recuperação.');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header com Banner Degradê */}
        <div className="relative bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-brand-700 shadow-md flex items-center justify-center text-xl font-black shrink-0 ring-4 ring-white/20">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight">{displayName}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                  Conta Ativa
                </span>
              </div>
              <p className="text-xs text-brand-100 flex items-center gap-1.5 mt-0.5">
                <Mail size={13} />
                <span>{userEmail}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          
          {/* Alertas */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check size={16} className="shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Cards de Métricas do Usuário */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Suas Métricas neste Perfil
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-xs text-slate-500 font-medium">Total</div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {stats?.total ?? 0}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 text-center">
                <div className="text-xs text-amber-700 font-medium">Pendentes</div>
                <div className="text-xl font-extrabold text-amber-800 mt-0.5">
                  {stats?.pendingCount ?? 0}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                <div className="text-xs text-emerald-700 font-medium">Concluídas</div>
                <div className="text-xl font-extrabold text-emerald-800 mt-0.5">
                  {stats?.completedCount ?? 0}
                </div>
              </div>
            </div>
          </div>

          {/* Edição do Nome */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nome de Exibição
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  id="profile-fullname"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  id="btn-save-profile"
                  disabled={isSaving}
                  className="absolute inset-y-1.5 right-1.5 px-3 rounded-lg text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1"
                >
                  {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  <span>Salvar</span>
                </button>
              </div>
            </div>
          </form>

          {/* Detalhes de Segurança e Conta */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" />
                Membro desde:
              </span>
              <span className="font-semibold text-slate-700">{createdDate}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-500" />
                Segurança:
              </span>
              <span className="font-semibold text-slate-700">Autenticação Supabase (JWT + RLS)</span>
            </div>
          </div>

          {/* Ações de Segurança e Logout */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              id="btn-profile-reset-pass"
              onClick={handleRequestPasswordReset}
              disabled={isSendingReset}
              className="w-full sm:flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-all"
            >
              {isSendingReset ? (
                <Loader2 size={14} className="animate-spin text-slate-500" />
              ) : (
                <KeyRound size={14} className="text-slate-500" />
              )}
              <span>Redefinir Senha</span>
            </button>

            <button
              type="button"
              id="btn-profile-logout"
              onClick={() => {
                onClose();
                logout();
              }}
              className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center justify-center gap-1.5 transition-all"
            >
              <LogOut size={14} />
              <span>Sair da Conta</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ProfileModal;
