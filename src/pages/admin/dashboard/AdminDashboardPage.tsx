// =====================================================
// ADMIN DASHBOARD - PANEL DE ADMINISTRACIÓN
// Distinct design focused on order management
// =====================================================

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  Users,
  Settings,
  RefreshCw,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../contexts/SupabaseAuthContext';
import { useAdminStore } from '../../../store/useAdminStore';
import { createPrimaryStats, createSecondaryStats } from './utils/statCardsConfig';
import PendingOrdersTable from './components/PendingOrdersTable';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, orders, isLoading, error, fetchStats, fetchOrders, refreshStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, [fetchStats, fetchOrders]);

  const primaryStats = createPrimaryStats(stats);
  const secondaryStats = createSecondaryStats(stats);

  const handleRefresh = () => {
    refreshStats();
    fetchOrders();
  };

  // Quick actions for admin
  const quickActions = [
    {
      title: 'Gestionar Órdenes',
      description: 'Ver y administrar todas las órdenes',
      icon: ClipboardList,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => navigate('/admin/orders'),
    },
    {
      title: 'Gestionar Usuarios',
      description: 'Administrar usuarios del sistema',
      icon: Users,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => navigate('/admin/users'),
    },
    {
      title: 'Gestionar Vehículos',
      description: 'Administrar flota de vehículos',
      icon: Truck,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      onClick: () => navigate('/admin/vehicles'),
    },
    {
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: Settings,
      color: 'bg-gray-600 hover:bg-gray-700',
      onClick: () => navigate('/admin/settings'),
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar datos
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimalistic Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                  Administrador
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Panel de Administración
              </h1>
              <p className="text-gray-500 mt-2">
                Bienvenido, {user?.user_metadata?.full_name || 'Admin'}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Primary Stats - Order focused */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-gray-400" />
            Resumen de Órdenes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {primaryStats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={index}
                  onClick={() => stat.href && navigate(stat.href)}
                  className="bg-white rounded-lg p-6 cursor-pointer hover:border-gray-300 transition-all duration-300 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      {stat.description && (
                        <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                      )}
                    </div>
                    <div className="p-2">
                      <StatIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Orders Table - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <PendingOrdersTable
              orders={orders}
              isLoading={isLoading}
              onRefresh={handleRefresh}
            />
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
              </div>
              <div className="p-4 space-y-3">
                {quickActions.map((action, index) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg p-4 text-left transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-white/10 rounded-lg mr-3">
                            <ActionIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold">{action.title}</p>
                            <p className="text-xs text-white/80">{action.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/60" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System Stats */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Estado del Sistema</h3>
              </div>
              <div className="p-4 space-y-3">
                {secondaryStats.map((stat, index) => {
                  const StatIcon = stat.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => stat.href && navigate(stat.href)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-lg mr-3">
                          <StatIcon className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{stat.title}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-5 h-5 mr-2 text-gray-500" />
                <span className="font-semibold text-gray-900">Información</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {stats.pendingOrders > 0
                  ? `Tienes ${stats.pendingOrders} órdenes pendientes que requieren tu atención.`
                  : '¡Excelente! No hay órdenes pendientes de revisión.'
                }
              </p>
              <button
                onClick={() => navigate('/admin/orders?status=pending')}
                className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Ver órdenes pendientes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
