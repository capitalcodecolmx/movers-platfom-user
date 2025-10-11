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
    console.log('getCurrentUser: Starting...');
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.log('Session error:', error);
        throw error;
      }

      if (session?.user) {
        console.log('User authenticated:', session.user.id);
        setUser(session.user);
      } else {
        console.log('No active session found');
        setUser(null);
      }
    } catch (error: any) {
      console.error('Error getting current user:', error);
      setUser(null);
    } finally {
      console.log('getCurrentUser: Setting loading to false');
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
      
      if (data.user) {
        setUser(data.user);
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
    console.log('AuthProvider: Initializing auth...');
    
    // Función para obtener usuario inicial
    const initAuth = async () => {
      await getCurrentUser();
    };
    
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []); // Dependencias vacías para que solo se ejecute una vez

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