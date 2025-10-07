// =====================================================
// COMPONENTE PARA MOSTRAR INFORMACIÓN DEL USUARIO
// =====================================================

import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const UserInfo: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error getting user:', error);
        setError(error.message);
        return;
      }

      console.log('Current user:', user);
      setUser(user);
    } catch (err: any) {
      console.error('Error in checkUser:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <p className="text-gray-600">Cargando información del usuario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl shadow-sm border border-red-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error de Usuario</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">No hay usuario autenticado</h3>
        <p className="text-yellow-700">Por favor, inicia sesión para continuar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Usuario</h3>
      
      <div className="space-y-2 text-sm">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Nombre:</strong> {user.user_metadata?.full_name || 'No especificado'}</p>
        <p><strong>Teléfono:</strong> {user.user_metadata?.phone || 'No especificado'}</p>
        <p><strong>Rol:</strong> {user.user_metadata?.role || 'user'}</p>
        <p><strong>Autenticado desde:</strong> {new Date(user.created_at).toLocaleString()}</p>
        <p><strong>Última sesión:</strong> {new Date(user.last_sign_in_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default UserInfo;
