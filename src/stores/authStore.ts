// =====================================================
// STORE DE AUTENTICACIÓN CON ZUSTAND
// =====================================================

import React from 'react';
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
          // Primero intentar obtener la sesión actual
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.log('Session error:', sessionError);
            throw sessionError;
          }

          if (session?.user) {
            // Usar los datos de la sesión
            const userData = {
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata?.full_name || 'Usuario',
              phone: session.user.user_metadata?.phone || null,
              role: session.user.user_metadata?.role || 'user',
              avatar_url: session.user.user_metadata?.avatar_url || null,
              is_active: true,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at,
              profile: null
            };

            console.log('User authenticated:', userData.id);
            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            console.log('No active session found');
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } catch (error: any) {
          console.error('Error getting current user:', error);
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
      // Configurar almacenamiento en localStorage
      storage: {
        getItem: (name: string) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name: string, value: any) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

// Hook para escuchar cambios de autenticación
export const useAuthListener = () => {
  const { getCurrentUser } = useAuthStore();

  // Escuchar cambios de autenticación
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await getCurrentUser();
      } else if (event === 'SIGNED_OUT') {
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getCurrentUser]);
};


