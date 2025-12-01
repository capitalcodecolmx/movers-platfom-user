// =====================================================
// HOOK PARA OBTENER EL ROL DEL USUARIO DESDE LA BASE DE DATOS
// =====================================================

import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { UserRole } from '../types/database';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          setIsLoading(false);
          return;
        }

        // Obtener el rol desde public.users
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          console.error('Error fetching user role:', fetchError);
          // Fallback a metadata si hay error
          const metadataRole = user.user_metadata?.role as UserRole;
          setRole(metadataRole || 'user');
        } else {
          setRole((data?.role as UserRole) || 'user');
        }
      } catch (err: any) {
        console.error('Error in useUserRole:', err);
        setError(err.message);
        setRole('user'); // Default fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = role === 'admin';
  const isRepartidor = role === 'repartidor';
  const isUser = role === 'user';

  return {
    role,
    isAdmin,
    isRepartidor,
    isUser,
    isLoading,
    error,
  };
};

