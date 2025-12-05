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
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header - Dark theme to distinguish from user dashboard */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Package className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-full">
                  Administrador
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white">
                Panel de Administración
              </h1>
              <p className="text-slate-400 mt-1">
                Bienvenido, {user?.user_metadata?.full_name || 'Admin'}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
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
                  className={`${stat.bgColor} rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-white/50`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      {stat.description && (
                        <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                      )}
                    </div>
                    <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                      <StatIcon className={`w-6 h-6 ${stat.color}`} />
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
                      className={`w-full ${action.color} text-white rounded-xl p-4 text-left transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-white/20 rounded-lg mr-3">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center">
                        <div className={`p-2 ${stat.bgColor} rounded-lg mr-3`}>
                          <StatIcon className={`w-4 h-4 ${stat.color}`} />
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
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-semibold">Información</span>
              </div>
              <p className="text-sm text-white/90 mb-4">
                {stats.pendingOrders > 0
                  ? `Tienes ${stats.pendingOrders} órdenes pendientes que requieren tu atención.`
                  : '¡Excelente! No hay órdenes pendientes de revisión.'
                }
              </p>
              <button
                onClick={() => navigate('/admin/orders?status=pending')}
                className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
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
