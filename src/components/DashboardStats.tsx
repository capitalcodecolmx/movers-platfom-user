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
  DollarSign,
  ShoppingBag,
  FileText,
  CreditCard,
  Zap
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
      iconGradient: 'from-cyan-400 to-blue-500',
      cardGradient: 'from-cyan-500/20 to-blue-600/20',
      borderColor: 'border-cyan-400/40',
      change: stats.activeOrders > 0 ? 'En progreso' : 'Sin envíos activos'
    },
    {
      title: 'En Tránsito',
      value: stats.inTransit,
      icon: Truck,
      iconGradient: 'from-teal-400 to-cyan-500',
      cardGradient: 'from-teal-500/20 to-cyan-600/20',
      borderColor: 'border-teal-400/40',
      change: stats.inTransit > 0 ? 'Llegando pronto' : 'Ninguno en tránsito'
    },
    {
      title: 'Entregados',
      value: stats.delivered,
      icon: CheckCircle,
      iconGradient: 'from-emerald-400 to-green-500',
      cardGradient: 'from-emerald-500/20 to-green-600/20',
      borderColor: 'border-emerald-400/40',
      change: `${stats.delivered} completados`
    },
    {
      title: 'Pendientes',
      value: stats.pending,
      icon: Clock,
      iconGradient: 'from-amber-400 to-orange-500',
      cardGradient: 'from-amber-500/20 to-orange-600/20',
      borderColor: 'border-amber-400/40',
      change: stats.pending > 0 ? 'En proceso' : 'Sin pendientes'
    }
  ];

  // Business-specific stat cards
  const businessStatCards = [
    {
      title: 'Órdenes de Envío',
      value: stats.shippingOrders,
      icon: Truck,
      iconGradient: 'from-blue-400 to-indigo-500',
      cardGradient: 'from-blue-500/20 to-indigo-600/20',
      borderColor: 'border-blue-400/40',
      change: `${stats.serviceTypeBreakdown.ftl} FTL, ${stats.serviceTypeBreakdown.ltl} LTL, ${stats.serviceTypeBreakdown.lastMile} Last Mile`
    },
    {
      title: 'Órdenes Ecommerce',
      value: stats.ecommerceOrders,
      icon: ShoppingBag,
      iconGradient: 'from-purple-400 to-pink-500',
      cardGradient: 'from-purple-500/20 to-pink-600/20',
      borderColor: 'border-purple-400/40',
      change: stats.ecommerceOrders > 0 ? 'Productos' : 'Sin pedidos'
    },
    {
      title: 'Cotizaciones',
      value: stats.quotePending + stats.quoteReady,
      icon: FileText,
      iconGradient: 'from-yellow-400 to-orange-500',
      cardGradient: 'from-yellow-500/20 to-orange-600/20',
      borderColor: 'border-yellow-400/40',
      change: `${stats.quotePending} pendientes, ${stats.quoteReady} listas`
    },
    {
      title: 'Pagos',
      value: stats.paymentConfirmed,
      icon: CreditCard,
      iconGradient: 'from-green-400 to-emerald-500',
      cardGradient: 'from-green-500/20 to-emerald-600/20',
      borderColor: 'border-green-400/40',
      change: `${stats.paymentPending} pendientes`
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

      {/* Estadísticas principales - Adaptadas para hero con colores mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`relative bg-gradient-to-br ${stat.cardGradient} backdrop-blur-xl rounded-xl p-4 border ${stat.borderColor} hover:border-opacity-60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden group`}
          >
            {/* Efecto de brillo en hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.iconGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="relative z-10 flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.iconGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white drop-shadow-lg">{stat.value}</p>
                <p className="text-xs text-white/95 font-semibold">{stat.title}</p>
              </div>
            </div>
            <p className="text-xs text-white/85 font-medium relative z-10">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Estadísticas de negocio - Desglose por tipo de servicio y prioridad */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white drop-shadow-md">Desglose de Negocio</h3>
        
        {/* Cards de negocio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {businessStatCards.map((stat, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br ${stat.cardGradient} backdrop-blur-xl rounded-xl p-4 border ${stat.borderColor} hover:border-opacity-60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.iconGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative z-10 flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.iconGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white drop-shadow-lg">{stat.value}</p>
                  <p className="text-xs text-white/95 font-semibold">{stat.title}</p>
                </div>
              </div>
              <p className="text-xs text-white/85 font-medium relative z-10">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Desglose por prioridad (solo si hay órdenes de envío) */}
        {stats.shippingOrders > 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Prioridad de Envíos
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-white drop-shadow-lg">{stats.priorityBreakdown.economico}</p>
                <p className="text-xs text-white/90 font-medium">Económico</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white drop-shadow-lg">{stats.priorityBreakdown.estandar}</p>
                <p className="text-xs text-white/90 font-medium">Estándar</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white drop-shadow-lg">{stats.priorityBreakdown.urgente}</p>
                <p className="text-xs text-white/90 font-medium">Urgente</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardStats;

