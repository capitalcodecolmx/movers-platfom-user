// =====================================================
// COMPONENTE DE ENCABEZADO DEL DASHBOARD
// =====================================================

import React from 'react';
import type { User } from '@supabase/supabase-js';

interface AdminDashboardHeaderProps {
  user: User | null;
}

const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({ user }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-1">
              Bienvenido, {user?.user_metadata?.full_name || 'Administrador'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-cyan-100 text-cyan-800 px-4 py-2 rounded-lg font-medium">
              Administrador
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;

