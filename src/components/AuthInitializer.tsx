// =====================================================
// INICIALIZADOR DE AUTENTICACIÓN
// =====================================================

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { getCurrentUser, isLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await getCurrentUser();
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [getCurrentUser]);

  // Mostrar loading mientras se inicializa la autenticación
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
