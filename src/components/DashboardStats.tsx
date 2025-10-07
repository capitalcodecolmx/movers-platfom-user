// =====================================================
// COMPONENTE DE ESTADÍSTICAS DEL DASHBOARD - ESTILO APPLE
// =====================================================

import React from 'react';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';
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
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: stats.activeOrders > 0 ? 'En progreso' : 'Sin envíos activos'
    },
    {
      title: 'En Tránsito',
      value: stats.inTransit,
      icon: Truck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: stats.inTransit > 0 ? 'Llegando pronto' : 'Ninguno en tránsito'
    },
    {
      title: 'Entregados',
      value: stats.delivered,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: `${stats.delivered} completados`
    },
    {
      title: 'Pendientes',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: stats.pending > 0 ? 'En proceso' : 'Sin pendientes'
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
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
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
      {/* Saludo personalizado - Adaptado para hero */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              ¡Hola, {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'}! 👋
            </h2>
            <p className="text-white/80 text-sm">
              Aquí tienes un resumen de tus envíos
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/70">Gastado este mes</p>
            <p className="text-2xl font-bold">${stats.thisMonthSpent.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Estadísticas principales - Adaptadas para hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-white">
                <stat.icon className="w-5 h-5 text-black" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/80">{stat.title}</p>
              </div>
            </div>
            <p className="text-xs text-white/70">{stat.change}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DashboardStats;

