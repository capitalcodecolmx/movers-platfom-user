// =====================================================
// DASHBOARD MÓVIL - CARDS DE PEDIDOS CON SCROLL HORIZONTAL
// =====================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  Plus,
  Search,
  ArrowRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import ScrollIndicator from './ScrollIndicator';
import OrderSummaryCards from './OrderSummaryCards';

interface MobileDashboardProps {
  user: any;
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const { stats, isLoading, error } = useDashboardStats();

  // Cards de estadísticas con scroll horizontal
  const statCards = [
    {
      title: 'En Progreso',
      value: stats.activeOrders,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Enviándose'
    },
    {
      title: 'En Tránsito',
      value: stats.inTransit,
      icon: Truck,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Llegando pronto'
    },
    {
      title: 'Entregados',
      value: stats.delivered,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Completados'
    },
    {
      title: 'Pendientes',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'En proceso'
    }
  ];

  // Cards de acciones principales
  const actionCards = [
    {
      id: 'crear-orden',
      title: 'Crear Orden',
      subtitle: 'Nuevo envío',
      icon: Plus,
      color: 'bg-gray-800',
      textColor: 'text-white',
      onClick: () => navigate('/orders/create'),
    },
    {
      id: 'mis-ordenes',
      title: 'Mis Órdenes',
      subtitle: `${stats.totalOrders} total`,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-white',
      onClick: () => navigate('/orders'),
    },
    {
      id: 'seguimiento',
      title: 'Seguimiento',
      subtitle: 'Rastrear envíos',
      icon: Search,
      color: 'bg-green-500',
      textColor: 'text-white',
      onClick: () => navigate('/tracking'),
    },
    {
      id: 'estadisticas',
      title: 'Estadísticas',
      subtitle: `$${stats.thisMonthSpent.toFixed(0)} gastado`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-white',
      onClick: () => navigate('/orders'),
    }
  ];

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        {/* Header skeleton */}
        <div className="bg-gray-100 rounded-2xl p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        
        {/* Stats skeleton */}
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-32 bg-gray-100 rounded-xl p-4 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
        
        {/* Actions skeleton */}
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-40 bg-gray-100 rounded-xl p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section con fondo de imagen - Adaptado para móvil */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat hero-mobile"
        style={{ backgroundImage: 'url(/back.png)' }}
      >
        {/* Overlay para mejorar legibilidad */}
        <div className="absolute inset-0 bg-black/20"></div>
        

        {/* Contenido del hero */}
        <div className="relative z-10 flex flex-col h-full px-4 pt-24 pb-8">
          <div className="w-full flex-1 flex flex-col justify-center">
            <div className="text-center mb-8">
              <p className="text-lg text-white/90">
                Gestiona tus envíos de manera fácil y rápida
              </p>
            </div>

            {/* Estadísticas integradas en el hero */}
            <div className="space-y-6">
              {/* Saludo personalizado - Adaptado para hero móvil */}
              <div className="glass-effect rounded-xl p-4 text-white mobile-hero-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-1">
                      ¡Hola, {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'}! 👋
                    </h2>
                    <p className="text-white/80 text-sm">
                      Aquí tienes un resumen de tus envíos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/70">Gastado este mes</p>
                    <p className="text-lg font-bold">${stats.thisMonthSpent.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Estadísticas principales - Compactas para móvil */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Estado de envíos</h2>
                <div className="grid grid-cols-2 gap-3">
                  {statCards.slice(0, 4).map((stat, index) => (
                    <div
                      key={index}
                      className="glass-effect rounded-xl p-3 mobile-hero-card"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-1.5 rounded-lg bg-white">
                          <stat.icon className="w-4 h-4 text-black" />
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">{stat.value}</p>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-white mb-1">{stat.title}</p>
                      <p className="text-xs text-white/70">{stat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones principales - Integradas en el hero */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Acciones principales</h2>
                
                <ScrollIndicator className="pb-2" showArrows={true}>
                  {actionCards.filter(action => action.id !== 'estadisticas').map((action) => (
                    <button
                      key={action.id}
                      onClick={action.onClick}
                      className="flex-shrink-0 w-40 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left mobile-card"
                    >
                      <div className={`p-3 rounded-xl ${action.color} mb-3`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-500">{action.subtitle}</p>
                    </button>
                  ))}
                </ScrollIndicator>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-4 space-y-6">


        {/* Órdenes recientes - Cards con scroll horizontal */}
        <OrderSummaryCards orders={stats.recentOrders} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default MobileDashboard;
