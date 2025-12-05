// =====================================================
// CONFIGURACIÓN DE TARJETAS DE ESTADÍSTICAS - ADMIN
// Focused on order management
// =====================================================

import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  UserX,
  AlertTriangle
} from 'lucide-react';
import type { StatCard } from '../types';
import type { AdminStats } from '../../../../store/useAdminStore';

// Primary stats - Order focused (displayed as large cards)
export const createPrimaryStats = (stats: AdminStats): StatCard[] => [
  {
    title: 'Órdenes Pendientes',
    value: stats.pendingOrders,
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
    href: '/admin/orders?status=pending',
    description: 'Requieren revisión',
  },
  {
    title: 'En Tránsito',
    value: stats.inTransitOrders,
    icon: Truck,
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    href: '/admin/orders?status=in_transit',
    description: 'En camino',
  },
  {
    title: 'Entregadas',
    value: stats.deliveredOrders,
    icon: CheckCircle,
    color: 'text-emerald-600',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
    href: '/admin/orders?status=delivered',
    description: 'Completadas',
  },
  {
    title: 'Total Órdenes',
    value: stats.totalOrders,
    icon: Package,
    color: 'text-indigo-600',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
    href: '/admin/orders',
    description: 'Todas las órdenes',
  },
];

// Secondary stats - Supporting info (displayed as smaller cards)
export const createSecondaryStats = (stats: AdminStats): StatCard[] => [
  {
    title: 'Usuarios',
    value: stats.totalUsers,
    icon: Package,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    href: '/admin/users',
  },
  {
    title: 'Vehículos',
    value: stats.activeVehicles,
    icon: Truck,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    href: '/admin/vehicles',
  },
  {
    title: 'Productos',
    value: stats.activeProducts,
    icon: Package,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    href: '/admin/products',
  },
  {
    title: 'Stock Bajo',
    value: stats.lowStockProducts,
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    href: '/admin/products?filter=low_stock',
  },
];

// Legacy export for backward compatibility
export const createStatCards = (stats: AdminStats): StatCard[] => [
  ...createPrimaryStats(stats),
  ...createSecondaryStats(stats),
];
