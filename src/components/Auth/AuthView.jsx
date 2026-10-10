import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  CheckSquare,
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Database,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export function AuthView() {
  const {
    login,
    signup,
    resetPassword,
    updatePassword,
    isPasswordRecovery,
    setIsPasswordRecovery,
  } = useAuth();

  // Modos de visualização: 'login' | 'signup' | 'forgot' | 'recovery'
  const [mode, setMode] = useState(isPasswordRecovery ? 'recovery' : 'login');

  // Preenche por padrão com os dados do primeiro usuário solicitado
  const [email, setEmail] = useState('sophiaamaralsv@gmail.com');
  const [password, setPassword] = useState('123456');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sincroniza se o estado isPasswordRecovery mudar
  useEffect(() => {
    if (isPasswordRecovery) {
      setMode('recovery');
    }
  }, [isPasswordRecovery]);

  // Limpa mensagens ao alternar de tela
  const switchMode = (newMode) => {
    setErrorMsg('');
    setSuccessMsg('');
    setMode(newMode);
  };

  // Preenche dados do usuário Sophia com 1 clique
  const handleFillSophia = () => {
    setEmail('sophiaamaralsv@gmail.com');
    setPassword('123456');
    setErrorMsg('');
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          throw new Error('Por favor, informe o e-mail e a senha.');
        }
        await login(email, password);
        // Login com sucesso redirecionará automaticamente pelo AuthProvider
      } else if (mode === 'signup') {
        if (!fullName.trim()) {
          throw new Error('Por favor, digite seu nome completo.');
        }
        if (!email.trim()) {
          throw new Error('Por favor, informe seu e-mail.');
        }
        if (password.length < 6) {
          throw new Error('A senha deve conter no mínimo 6 caracteres.');
        }
        if (password !== confirmPassword) {
          throw new Error('As senhas digitadas não coincidem.');
        }

        const data = await signup(email, password, fullName);
        if (data?.session) {
          setSuccessMsg('Conta criada com sucesso! Redirecionando...');
        } else {
          setSuccessMsg(
            'Conta criada com sucesso! Verifique seu e-mail para confirmar a ativação ou faça login.'
          );
          setTimeout(() => switchMode('login'), 3500);
        }
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          throw new Error('Por favor, digite seu e-mail para recuperar a senha.');
        }
        await resetPassword(email);
        setSuccessMsg(
          `Enviamos um link de redefinição para ${email.trim()}. Verifique sua caixa de entrada e spam.`
        );
      } else if (mode === 'recovery') {
        if (password.length < 6) {
          throw new Error('A nova senha deve ter no mínimo 6 caracteres.');
        }
        if (password !== confirmPassword) {
          throw new Error('As senhas digitadas não coincidem.');
        }
        await updatePassword(password);
        setSuccessMsg('Senha atualizada com sucesso! Acessando sua conta...');
      }
    } catch (err) {
      console.error('Erro na autenticação:', err);
      let friendly = err.message || 'Ocorreu um erro. Tente novamente.';
      
      // Tradução amigável dos erros do Supabase
      if (friendly.includes('Invalid login credentials')) {
        friendly = 'E-mail ou senha incorretos. Verifique suas credenciais.';
      } else if (friendly.includes('User already registered')) {
        friendly = 'Este e-mail já está cadastrado. Faça login ou recupere sua senha.';
      } else if (friendly.includes('Password should be at least 6 characters')) {
        friendly = 'A senha deve possuir no mínimo 6 caracteres.';
      } else if (friendly.includes('Email not confirmed')) {
        friendly = 'Este e-mail ainda não foi confirmado. Verifique sua caixa de entrada.';
      } else if (friendly.includes('rate limit')) {
        friendly = 'Muitas tentativas em pouco tempo. Por favor, aguarde alguns instantes.';
      }

      setErrorMsg(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background Glows and Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-xl shadow-brand-500/25 mb-4 animate-scale-in">
            <CheckSquare className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Task<span className="text-brand-600">Flow</span>
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            {mode === 'login' && 'Entre na sua conta para acessar suas tarefas'}
            {mode === 'signup' && 'Crie sua conta e tenha seu próprio perfil de tarefas'}
            {mode === 'forgot' && 'Recupere o acesso à sua conta'}
            {mode === 'recovery' && 'Defina uma nova senha para sua conta'}
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 backdrop-blur-xl">
          
          {/* Navegação entre Login e Cadastro */}
          {mode !== 'forgot' && mode !== 'recovery' && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
              <button
                type="button"
                id="tab-login"
                onClick={() => switchMode('login')}
                className={`py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                id="tab-signup"
                onClick={() => switchMode('signup')}
                className={`py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Criar Conta
              </button>
            </div>
          )}

          {/* Feedback de Erro */}
          {errorMsg && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <div className="font-medium leading-tight">{errorMsg}</div>
            </div>
          )}

          {/* Feedback de Sucesso */}
          {successMsg && (
            <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
              <div className="font-medium leading-tight">{successMsg}</div>
            </div>
          )}

          {/* Atalho rápido para o usuário Sophia (Demo) */}
          {mode === 'login' && (
            <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-100/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  SA
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>Sophia Amaral</span>
                    <span className="text-[10px] font-semibold bg-brand-100 text-brand-700 px-1.5 py-0.2 rounded-md">
                      Padrão
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">sophiaamaralsv@gmail.com</div>
                </div>
              </div>
              <button
                type="button"
                id="btn-fill-sophia"
                onClick={handleFillSophia}
                className="shrink-0 px-2.5 py-1.5 text-xs font-semibold text-brand-700 bg-white hover:bg-brand-50 border border-brand-200 rounded-xl transition-all shadow-2xs hover:border-brand-300"
                title="Preencher credenciais da Sophia"
              >
                Preencher
              </button>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo Nome Completo (Apenas no cadastro) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    id="input-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Sophia Amaral"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* Campo E-mail (Em Login, Cadastro e Recuperação) */}
            {mode !== 'recovery' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Endereço de E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="input-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* Campo Senha (Em Login, Cadastro e Nova Senha) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {mode === 'recovery' ? 'Nova Senha' : 'Senha'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      id="btn-forgot-password"
                      onClick={() => switchMode('forgot')}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="input-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'recovery' ? 'Mínimo 6 caracteres' : '••••••••'}
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirmação de Senha (No Cadastro ou Recuperação) */}
            {(mode === 'signup' || mode === 'recovery') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound size={18} />
                  </div>
                  <input
                    id="input-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a mesma senha"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Exibir confirmação de senha'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Botão de Submissão Principal */}
            <div className="pt-2">
              <button
                type="submit"
                id="btn-auth-submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all duration-150"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Entrar na Conta'}
                      {mode === 'signup' && 'Criar Conta e Começar'}
                      {mode === 'forgot' && 'Enviar Link de Recuperação'}
                      {mode === 'recovery' && 'Salvar Nova Senha'}
                    </span>
                    <ArrowRight size={17} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>

            {/* Links Auxiliares de Navegação */}
            {mode === 'forgot' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  id="btn-back-to-login"
                  onClick={() => switchMode('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Voltar para o login</span>
                </button>
              </div>
            )}

            {mode === 'recovery' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordRecovery(false);
                    switchMode('login');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Cancelar redefinição</span>
                </button>
              </div>
            )}

          </form>

          {/* Rodapé do Card: Destaque de Multi-usuário e Supabase Auth */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-500" />
              Supabase Auth (RLS Ativo)
            </span>
            <span className="flex items-center gap-1">
              <UserCheck size={13} className="text-brand-500" />
              Tarefas isoladas por usuário
            </span>
          </div>

        </div>

        {/* Rodapé Externo */}
        <div className="text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} TaskFlow • Projeto Supabase Conectado</p>
        </div>

      </div>

    </div>
  );
}
export default AuthView;
