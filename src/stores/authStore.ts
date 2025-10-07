// =====================================================
// STORE DE AUTENTICACIÓN CON ZUSTAND
// =====================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../config/supabase';
import type { User, UserWithProfile } from '../types/database';

// Tipo más flexible para el usuario en el contexto de autenticación
interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: string;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  profile?: any | null;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      // Acciones
      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          // Usar solo los datos de Supabase Auth
          if (data.user) {
            const userData = {
              id: data.user.id,
              email: data.user.email!,
              full_name: data.user.user_metadata?.full_name || 'Usuario',
              phone: data.user.user_metadata?.phone || null,
              role: data.user.user_metadata?.role || 'user',
              avatar_url: data.user.user_metadata?.avatar_url || null,
              is_active: true,
              created_at: data.user.created_at,
              updated_at: data.user.updated_at,
              profile: null
            };

            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error: any) {
          set({
            error: error.message || 'Error al iniciar sesión',
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
        }
      },

      signUp: async (email: string, password: string, fullName: string, phone?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                phone: phone || null,
                role: 'user', // Registro automático como cliente
              },
            },
          });

          if (error) throw error;

          // Solo usar Supabase Auth, no crear registros manuales
          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Error al registrarse',
            isLoading: false,
          });
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Error al cerrar sesión',
            isLoading: false,
          });
        }
      },

      getCurrentUser: async () => {
        set({ isLoading: true });
        
        try {
          const { data: { user }, error } = await supabase.auth.getUser();
          
          if (error) throw error;

          if (user) {
            // Usar solo los datos de Supabase Auth
            const userData = {
              id: user.id,
              email: user.email!,
              full_name: user.user_metadata?.full_name || 'Usuario',
              phone: user.user_metadata?.phone || null,
              role: user.user_metadata?.role || 'user',
              avatar_url: user.user_metadata?.avatar_url || null,
              is_active: true,
              created_at: user.created_at,
              updated_at: user.updated_at,
              profile: null
            };

            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Error al obtener usuario',
          });
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook para escuchar cambios de autenticación
export const useAuthListener = () => {
  const { getCurrentUser } = useAuthStore();

  // Escuchar cambios de autenticación
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      getCurrentUser();
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  });
};


