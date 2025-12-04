// =====================================================
// COMPONENTE DE ESTADÍSTICAS DEL DASHBOARD - ESTILO APPLE
// =====================================================

import React from 'react';
import { Icon } from '@iconify/react';
import { useDashboardStats } from '../hooks/useDashboardStats';

interface DashboardStatsProps {
  user: any;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ user }) => {
  const { stats, isLoading, error } = useDashboardStats();

  const statCards = [
    {
      title: 'Envíos Activos',
      value: stats.activeOrders,
      iconName: 'mdi:package-variant',
      iconBg: 'bg-blue-500',
      cardGradient: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-400/20',
      change: stats.activeOrders > 0 ? 'Sin envíos activos' : 'Sin envíos activos'
    },
    {
      title: 'En Tránsito',
      value: stats.inTransit,
      iconName: 'mdi:truck-delivery',
      iconBg: 'bg-cyan-500',
      cardGradient: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-400/20',
      change: stats.inTransit > 0 ? 'Ninguno en tránsito' : 'Ninguno en tránsito'
    },
    {
      title: 'Entregados',
      value: stats.delivered,
      iconName: 'mdi:check-circle',
      iconBg: 'bg-green-500',
      cardGradient: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-400/20',
      change: `0 completados`
    },
    {
      title: 'Pendientes',
      value: stats.pending,
      iconName: 'mdi:clock-outline',
      iconBg: 'bg-orange-500',
      cardGradient: 'from-blue-500/10 to-purple-600/10',
      borderColor: 'border-blue-400/20',
      change: stats.pending > 0 ? 'Sin pendientes' : 'Sin pendientes'
    }
  ];



  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Saludo personalizado - Skeleton */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white border border-white/20 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 bg-white/20 rounded w-48 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-32"></div>
            </div>
            <div className="text-right">
              <div className="h-3 bg-white/20 rounded w-24 mb-1"></div>
              <div className="h-6 bg-white/20 rounded w-16"></div>
            </div>
          </div>
        </div>

        {/* Estadísticas - Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-white/20 w-10 h-10"></div>
                <div className="text-right">
                  <div className="h-6 bg-white/20 rounded w-8 mb-1"></div>
                  <div className="h-3 bg-white/20 rounded w-16"></div>
                </div>
              </div>
              <div className="h-3 bg-white/20 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center">
          <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-600 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error al cargar estadísticas</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saludo personalizado - Adaptado para hero con gradiente mejorado */}
      <div className="relative bg-gradient-to-r from-white/20 via-white/15 to-white/20 backdrop-blur-xl rounded-2xl p-6 text-white border border-white/40 shadow-2xl overflow-hidden">
        {/* Efecto de brillo animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1 drop-shadow-lg bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
              ¡Hola, {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'}! 👋
            </h2>
            <p className="text-white/95 text-sm drop-shadow-md font-medium">
              Aquí tienes un resumen de tus envíos
            </p>
          </div>
          <div className="text-right bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-xl px-4 py-3 border border-cyan-300/30 backdrop-blur-sm">
            <p className="text-xs text-white/90 font-semibold mb-1">Gastado este mes</p>
            <p className="text-3xl font-bold drop-shadow-lg bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
              ${stats.thisMonthSpent.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas principales - Solo lo esencial */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`relative bg-gradient-to-br ${stat.cardGradient} backdrop-blur-xl rounded-2xl p-5 border ${stat.borderColor} hover:border-opacity-60 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
          >
            <div className="relative z-10 flex items-center justify-between mb-3">
              <div className={`p-3 rounded-2xl ${stat.iconBg} shadow-md`}>
                <Icon icon={stat.iconName} className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white drop-shadow-lg">{stat.value}</p>
                <p className="text-xs text-white/90 font-medium mt-1">{stat.title}</p>
              </div>
            </div>
            <p className="text-xs text-white/75 font-medium relative z-10">{stat.change}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DashboardStats;

