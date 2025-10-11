// =====================================================
// CONTEXTO DE AUTENTICACIÓN SIMPLIFICADO CON SUPABASE
// =====================================================

import React, { createContext, useContext, type ReactNode } from 'react';
import { useAuthStore, useAuthListener } from '../stores/authStore';

interface AuthContextType {
  user: any;
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
  const {
    user,
    isLoading,
    isAuthenticated,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  } = useAuthStore();

  // Inicializar listener de autenticación
  useAuthListener();

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