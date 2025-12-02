// =====================================================
// CONFIGURACIÓN DE TARJETAS DE ESTADÍSTICAS
// =====================================================

import { 
  Package, 
  Users, 
  Truck, 
  DollarSign, 
  CheckCircle,
  Clock,
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';
import type { StatCard } from '../types';
import type { AdminStats } from '../../../../store/useAdminStore';

export const createStatCards = (stats: AdminStats): StatCard[] => [
  {
    title: 'Total Órdenes',
    value: stats.totalOrders,
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    href: '/admin/orders',
  },
  {
    title: 'Órdenes Pendientes',
    value: stats.pendingOrders,
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    href: '/admin/orders?status=pending',
  },
  {
    title: 'En Tránsito',
    value: stats.inTransitOrders,
    icon: Truck,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    href: '/admin/orders?status=in_transit',
  },
  {
    title: 'Entregadas',
    value: stats.deliveredOrders,
    icon: CheckCircle,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    href: '/admin/orders?status=delivered',
  },
  {
    title: 'Total Usuarios',
    value: stats.totalUsers,
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    href: '/admin/users',
  },
  {
    title: 'Ingresos Totales',
    value: `$${stats.totalRevenue.toFixed(2)}`,
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    href: '/admin/revenue',
  },
  {
    title: 'Vehículos Activos',
    value: stats.activeVehicles,
    icon: Truck,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    href: '/admin/vehicles',
  },
  {
    title: 'Total Productos',
    value: stats.totalProducts,
    icon: ShoppingBag,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    href: '/admin/products',
  },
  {
    title: 'Productos Activos',
    value: stats.activeProducts,
    icon: ShoppingBag,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    href: '/admin/products?filter=active',
  },
  {
    title: 'Stock Bajo',
    value: stats.lowStockProducts,
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    href: '/admin/products?filter=low_stock',
  },
  {
    title: 'Órdenes de Productos',
    value: stats.totalProductOrders,
    icon: Package,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    href: '/admin/orders?type=ecommerce',
  },
  {
    title: 'Ingresos por Productos',
    value: `$${stats.productRevenue.toFixed(2)}`,
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    href: '/admin/revenue?type=products',
  },
];

