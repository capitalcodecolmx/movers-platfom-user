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
  DollarSign,
  ShoppingBag,
  FileText,
  CreditCard,
  Zap
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
      iconColor: 'text-gray-500',
      description: 'Enviándose'
    },
    {
      title: 'En Tránsito',
      value: stats.inTransit,
      icon: Truck,
      iconColor: 'text-gray-500',
      description: 'Llegando pronto'
    },
    {
      title: 'Entregados',
      value: stats.delivered,
      icon: CheckCircle,
      iconColor: 'text-gray-500',
      description: 'Completados'
    },
    {
      title: 'Pendientes',
      value: stats.pending,
      icon: Clock,
      iconColor: 'text-gray-500',
      description: 'En proceso'
    }
  ];

  // Cards de acciones principales
  const actionCards = [
    {
      id: 'crear-orden',
      title: 'Hacer Pedido',
      subtitle: 'Nuevo envío',
      icon: Plus,
      color: 'bg-gray-900',
      onClick: () => navigate('/orders/create'),
    },
    {
      id: 'mis-ordenes',
      title: 'Mis Pedidos',
      subtitle: `${stats.totalOrders} total`,
      icon: Package,
      color: 'bg-gray-700',
      onClick: () => navigate('/orders'),
    },
    {
      id: 'seguimiento',
      title: 'Seguimiento',
      subtitle: 'Rastrear envíos',
      icon: Search,
      color: 'bg-gray-700',
      onClick: () => navigate('/tracking'),
    },
    {
      id: 'estadisticas',
      title: 'Estadísticas',
      subtitle: `$${stats.thisMonthSpent.toFixed(0)} gastado`,
      icon: TrendingUp,
      color: 'bg-gray-700',
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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Simplified minimal design */}
      <div className="relative min-h-screen bg-gray-50">
        {/* Simple minimal overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>

        {/* Contenido del hero */}
        <div className="relative z-10 flex flex-col h-full px-4 pt-16 pb-8">
          <div className="w-full flex-1 flex flex-col">
            {/* Estadísticas integradas */}
            <div className="space-y-6">
              {/* Saludo personalizado - Minimal design */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-1 text-gray-900">
                      ¡Hola, {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'}! 👋
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Gestiona tus envíos de manera fácil y rápida
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium">Este mes</p>
                    <p className="text-lg font-bold text-gray-900">${stats.thisMonthSpent.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Estadísticas principales - Minimal design */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Estado de envíos</h2>
                <div className="grid grid-cols-2 gap-3">
                  {statCards.slice(0, 4).map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <p className="text-xs font-medium text-gray-900 mb-1">{stat.title}</p>
                      <p className="text-xs text-gray-500">{stat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones principales - Minimal design */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Acciones principales</h2>

                <ScrollIndicator className="pb-2" showArrows={true}>
                  {actionCards.filter(action => action.id !== 'estadisticas').map((action) => (
                    <button
                      key={action.id}
                      onClick={action.onClick}
                      className="flex-shrink-0 w-40 bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 text-left"
                    >
                      <div className={`p-3 rounded-lg ${action.color} mb-3`}>
                        <action.icon className="w-5 h-5 text-white" />
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
        {/* Desglose de negocio - Compacto para móvil */}
        {(stats.shippingOrders > 0 || stats.ecommerceOrders > 0) && (
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-cyan-600" />
              Desglose de Negocio
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-between mb-1">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-600">{stats.shippingOrders}</span>
                </div>
                <p className="text-xs text-gray-600">Pedidos Envío</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <div className="flex items-center justify-between mb-1">
                  <ShoppingBag className="w-4 h-4 text-purple-600" />
                  <span className="text-lg font-bold text-purple-600">{stats.ecommerceOrders}</span>
                </div>
                <p className="text-xs text-gray-600">Ecommerce</p>
              </div>
            </div>

            {/* Desglose por tipo de servicio */}
            {stats.shippingOrders > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700 mb-2">Tipo de Servicio:</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-sm font-bold text-gray-900">{stats.serviceTypeBreakdown.ftl}</p>
                    <p className="text-xs text-gray-600">FTL</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-sm font-bold text-gray-900">{stats.serviceTypeBreakdown.ltl}</p>
                    <p className="text-xs text-gray-600">LTL</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-sm font-bold text-gray-900">{stats.serviceTypeBreakdown.lastMile}</p>
                    <p className="text-xs text-gray-600">Last Mile</p>
                  </div>
                </div>
              </div>
            )}

            {/* Desglose por prioridad */}
            {stats.shippingOrders > 0 && (stats.priorityBreakdown.economico > 0 || stats.priorityBreakdown.estandar > 0 || stats.priorityBreakdown.urgente > 0) && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Prioridad:</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-green-50 rounded-lg p-2 border border-green-100">
                    <p className="text-sm font-bold text-green-700">{stats.priorityBreakdown.economico}</p>
                    <p className="text-xs text-green-600">Económico</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                    <p className="text-sm font-bold text-blue-700">{stats.priorityBreakdown.estandar}</p>
                    <p className="text-xs text-blue-600">Estándar</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2 border border-red-100">
                    <p className="text-sm font-bold text-red-700">{stats.priorityBreakdown.urgente}</p>
                    <p className="text-xs text-red-600">Urgente</p>
                  </div>
                </div>
              </div>
            )}

            {/* Cotizaciones y pagos */}
            {(stats.quotePending > 0 || stats.quoteReady > 0 || stats.paymentPending > 0) && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  {(stats.quotePending > 0 || stats.quoteReady > 0) && (
                    <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-100">
                      <div className="flex items-center justify-between mb-1">
                        <FileText className="w-3 h-3 text-yellow-600" />
                        <span className="text-sm font-bold text-yellow-700">{stats.quotePending + stats.quoteReady}</span>
                      </div>
                      <p className="text-xs text-yellow-600">Cotizaciones</p>
                    </div>
                  )}

                  {stats.paymentPending > 0 && (
                    <div className="bg-orange-50 rounded-lg p-2 border border-orange-100">
                      <div className="flex items-center justify-between mb-1">
                        <CreditCard className="w-3 h-3 text-orange-600" />
                        <span className="text-sm font-bold text-orange-700">{stats.paymentPending}</span>
                      </div>
                      <p className="text-xs text-orange-600">Pagos Pend.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Órdenes recientes - Cards con scroll horizontal */}
        <OrderSummaryCards orders={stats.recentOrders} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default MobileDashboard;
