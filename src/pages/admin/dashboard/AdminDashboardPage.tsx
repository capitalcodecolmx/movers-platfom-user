// =====================================================
// PÁGINA DE DASHBOARD PARA ADMINISTRADORES
// =====================================================

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/SupabaseAuthContext';
import { useAdminStore } from '../../../store/useAdminStore';
import AdminDashboardHeader from './components/AdminDashboardHeader';
import AdminStatsCards from './components/AdminStatsCards';
import AdminQuickActions from './components/AdminQuickActions';
import AdminSystemInfo from './components/AdminSystemInfo';
import AdminDashboardSkeleton from './components/AdminDashboardSkeleton';
import { createStatCards } from './utils/statCardsConfig';
import { createQuickActions } from './utils/quickActionsConfig';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, isLoading, error, fetchStats, refreshStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = createStatCards(stats);
  const quickActions = createQuickActions(navigate);

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error al cargar estadísticas
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refreshStats}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardHeader user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Resumen General
            </h2>
            <button
              onClick={refreshStats}
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
            >
              Actualizar
            </button>
          </div>
          <AdminStatsCards stats={statCards} />
        </div>

        {/* Acciones Rápidas */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Acciones Rápidas
          </h2>
          <AdminQuickActions actions={quickActions} />
        </div>

        {/* Información del Sistema */}
        <AdminSystemInfo
          pendingOrders={stats.pendingOrders}
          deliveredOrders={stats.deliveredOrders}
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;

