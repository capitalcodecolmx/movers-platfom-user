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
      iconColor: 'text-gray-500',
      change: stats.activeOrders > 0 ? 'Sin envíos activos' : 'Sin envíos activos'
    },
    {
      title: 'En Tránsito',
      value: stats.inTransit,
      iconName: 'mdi:truck-delivery',
      iconColor: 'text-gray-500',
      change: stats.inTransit > 0 ? 'Ninguno en tránsito' : 'Ninguno en tránsito'
    },
    {
      title: 'Entregados',
      value: stats.delivered,
      iconName: 'mdi:check-circle',
      iconColor: 'text-gray-500',
      change: `0 completados`
    },
    {
      title: 'Pendientes',
      value: stats.pending,
      iconName: 'mdi:clock-outline',
      iconColor: 'text-gray-500',
      change: stats.pending > 0 ? 'Sin pendientes' : 'Sin pendientes'
    }
  ];

  if (isLoading) {
    return (
      /* Simple skeleton for new layout */
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-gray-100 w-10 h-10"></div>
              <div className="text-right">
                <div className="h-6 bg-gray-100 rounded w-8 mb-1"></div>
                <div className="h-3 bg-gray-100 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-8 border border-gray-200 hover:border-gray-300 transition-colors duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <Icon icon={stat.iconName} className={`w-6 h-6 ${stat.iconColor}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">{stat.title}</p>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">{stat.change}</span>
          </div>
        </div>
      ))}

      {/* "Gastado este mes" moved to a card */}
      <div className="bg-white rounded-lg p-8 border border-gray-900 md:col-span-2 lg:col-span-1">
        <div className="flex flex-col h-full justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-2">Gastado este mes</p>
            <h3 className="text-3xl font-bold text-gray-900">${stats.thisMonthSpent.toFixed(2)}</h3>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">Actualizado recientemente</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

