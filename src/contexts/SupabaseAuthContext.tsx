// =====================================================
// CONTEXTO DE AUTENTICACIÓN SIMPLIFICADO CON SUPABASE
// =====================================================

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../config/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Obtener usuario actual
  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (user) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          // Crear objeto de usuario enriquecido
          const enrichedUser = {
            ...user,
            user_metadata: {
              ...user.user_metadata,
              full_name: userData?.full_name || user.user_metadata?.full_name,
              phone: userData?.phone || user.user_metadata?.phone,
              role: userData?.role || user.user_metadata?.role,
            },
            profile: profileData || null
          };

          setUser(enrichedUser);
        } catch (dbError) {
          // Si hay error con la base de datos, usar solo datos de Auth
          console.warn('Error fetching user data from database:', dbError);
          setUser(user);
        }
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.error('Error getting user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Iniciar sesión
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Obtener datos adicionales de nuestras tablas si existen
      if (data.user) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .single();

          // Crear objeto de usuario enriquecido
          const enrichedUser = {
            ...data.user,
            user_metadata: {
              ...data.user.user_metadata,
              full_name: userData?.full_name || data.user.user_metadata?.full_name,
              phone: userData?.phone || data.user.user_metadata?.phone,
              role: userData?.role || data.user.user_metadata?.role,
            },
            profile: profileData || null
          };

          setUser(enrichedUser);
        } catch (dbError) {
          // Si hay error con la base de datos, usar solo datos de Auth
          console.warn('Error fetching user data from database:', dbError);
          setUser(data.user);
        }
      }
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  // Registrarse
  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || null,
            role: 'user',
          },
        },
      });

      if (error) throw error;

      // 2. Si el usuario se creó exitosamente, crear registro en nuestra tabla users
      if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            password_hash: '', // Se maneja por Supabase Auth
            full_name: fullName,
            phone: phone || null,
            role: 'user',
            is_active: true,
          });

        if (insertError) {
          console.error('Error inserting user:', insertError);
          // No lanzar error aquí, el usuario ya está creado en Auth
        }

        // 3. Crear perfil de usuario
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            country: 'México',
          });

        if (profileError) {
          console.error('Error inserting profile:', profileError);
          // No lanzar error aquí
        }
      }
      
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar sesión
  const signOut = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
    } catch (error: any) {
      setError(error.message || 'Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar error
  const clearError = () => setError(null);

  // Escuchar cambios de autenticación
  useEffect(() => {
    getCurrentUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
