import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  // Carrega os dados de perfil vinculados ao usuário
  const fetchProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }

    try {
      const data = await authService.getProfile(currentUser.id);
      if (data) {
        setProfile(data);
      } else {
        // Fallback para metadados caso não esteja na tabela ainda
        setProfile({
          id: currentUser.id,
          email: currentUser.email,
          full_name:
            currentUser.user_metadata?.full_name ||
            currentUser.user_metadata?.name ||
            currentUser.email?.split('@')[0] ||
            'Usuário',
          avatar_url: null,
        });
      }
    } catch (err) {
      console.warn('Erro ao carregar perfil:', err);
    }
  }, []);

  // Inicializa sessão e escuta eventos de autenticação
  useEffect(() => {
    let isMounted = true;

    // Detecta se a URL contém hash de recuperação de senha (type=recovery)
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get('type') === 'recovery') {
        setIsPasswordRecovery(true);
      }
    }

    const initAuth = async () => {
      try {
        const currentSession = await authService.getSession();
        if (isMounted) {
          setSession(currentSession);
          const currentUser = currentSession?.user || null;
          setUser(currentUser);
          if (currentUser) {
            await fetchProfile(currentUser);
          }
        }
      } catch (err) {
        console.error('Erro na inicialização de autenticação:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Inscreve-se em mudanças de autenticação
    const { data: { subscription } } = authService.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);
      const currentUser = newSession?.user || null;
      setUser(currentUser);

      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        if (currentUser) {
          await fetchProfile(currentUser);
        }
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setIsPasswordRecovery(false);
      }
    });

    return () => {
      isMounted = false;
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [fetchProfile]);

  // Login
  const login = useCallback(async (email, password) => {
    const data = await authService.signIn({ email, password });
    setUser(data.user);
    setSession(data.session);
    if (data.user) {
      await fetchProfile(data.user);
    }
    return data;
  }, [fetchProfile]);

  // Cadastro
  const signup = useCallback(async (email, password, fullName) => {
    const data = await authService.signUp({ email, password, fullName });
    if (data?.session) {
      setUser(data.user);
      setSession(data.session);
      if (data.user) {
        await fetchProfile(data.user);
      }
    }
    return data;
  }, [fetchProfile]);

  // Logout
  const logout = useCallback(async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsPasswordRecovery(false);
  }, []);

  // Solicitar recuperação de senha
  const resetPassword = useCallback(async (email) => {
    return await authService.resetPasswordForEmail(email);
  }, []);

  // Atualizar senha após recuperação
  const updatePassword = useCallback(async (newPassword) => {
    const res = await authService.updatePassword(newPassword);
    setIsPasswordRecovery(false);
    return res;
  }, []);

  // Atualizar dados do perfil
  const updateProfile = useCallback(async ({ fullName, avatarUrl }) => {
    if (!user) return null;
    const updated = await authService.updateProfile(user.id, { fullName, avatarUrl });
    if (updated) {
      setProfile(updated);
    }
    return updated;
  }, [user]);

  // Atualizar perfil manualmente
  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user);
    }
  }, [user, fetchProfile]);

  const value = {
    user,
    session,
    profile,
    isLoading,
    isPasswordRecovery,
    setIsPasswordRecovery,
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
