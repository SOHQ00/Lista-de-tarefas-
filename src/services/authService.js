import { supabase, isSupabaseConfigured } from './supabaseClient';

export const authService = {
  isConfigured: isSupabaseConfigured,

  /**
   * Obtém a sessão atual
   */
  async getSession() {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Erro ao obter sessão:', error);
      return null;
    }
    return session;
  },

  /**
   * Obtém o usuário atual
   */
  async getCurrentUser() {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
    return user;
  },

  /**
   * Realiza login com e-mail e senha
   */
  async signIn({ email, password }) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase não está configurado.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Cria nova conta (Sign Up)
   */
  async signUp({ email, password, fullName }) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase não está configurado.');
    }

    const trimmedEmail = email.trim();
    const trimmedName = fullName?.trim() || trimmedEmail.split('@')[0];

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: trimmedName,
          name: trimmedName,
        },
      },
    });

    if (error) {
      throw error;
    }

    // Se a sessão foi iniciada imediatamente (email confirmation desativado),
    // garante perfil na tabela profiles
    if (data?.user) {
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: trimmedEmail,
            full_name: trimmedName,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
      } catch (profileErr) {
        console.warn('Aviso ao sincronizar perfil pós-cadastro:', profileErr);
      }
    }

    return data;
  },

  /**
   * Envia e-mail de recuperação de senha
   */
  async resetPasswordForEmail(email) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase não está configurado.');
    }

    const redirectTo = window.location.origin;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Atualiza a senha do usuário autenticado (usado após recuperação)
   */
  async updatePassword(newPassword) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase não está configurado.');
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Realiza logout
   */
  async signOut() {
    if (!isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro ao deslogar:', error);
      throw error;
    }
  },

  /**
   * Busca dados do perfil do usuário em public.profiles
   */
  async getProfile(userId) {
    if (!isSupabaseConfigured || !supabase || !userId) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Erro ao buscar perfil do banco:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.warn('Falha de conexão ao buscar perfil:', err);
      return null;
    }
  },

  /**
   * Atualiza informações de perfil (nome, avatar, etc)
   */
  async updateProfile(userId, { fullName, avatarUrl }) {
    if (!isSupabaseConfigured || !supabase || !userId) return null;

    const updates = {
      id: userId,
      updated_at: new Date().toISOString(),
    };
    if (fullName !== undefined) updates.full_name = fullName.trim();
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

    const { data, error } = await supabase
      .from('profiles')
      .upsert(updates)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Atualiza também os metadados do auth.user
    if (fullName) {
      try {
        await supabase.auth.updateUser({
          data: { full_name: fullName.trim() },
        });
      } catch (authErr) {
        console.warn('Aviso ao sincronizar metadados do usuário:', authErr);
      }
    }

    return data;
  },

  /**
   * Inscreve-se nas mudanças de estado de autenticação
   */
  onAuthStateChange(callback) {
    if (!isSupabaseConfigured || !supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return supabase.auth.onAuthStateChange(callback);
  },
};
