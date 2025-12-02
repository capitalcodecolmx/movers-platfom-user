// =====================================================
// CONFIGURACIÓN DE ACCIONES RÁPIDAS
// =====================================================

import { 
  Package, 
  Users, 
  Truck, 
  DollarSign,
  ShoppingBag
} from 'lucide-react';
import type { QuickAction } from '../types';

export const createQuickActions = (
  navigate: (path: string) => void
): QuickAction[] => [
  {
    title: 'Gestionar Productos',
    description: 'Administrar catálogo de productos',
    icon: ShoppingBag,
    onClick: () => navigate('/admin/products'),
    color: 'bg-cyan-500 hover:bg-cyan-600',
  },
  {
    title: 'Gestionar Órdenes',
    description: 'Ver y administrar todas las órdenes',
    icon: Package,
    onClick: () => navigate('/admin/orders'),
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    title: 'Gestionar Usuarios',
    description: 'Ver y administrar usuarios del sistema',
    icon: Users,
    onClick: () => navigate('/admin/users'),
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    title: 'Gestionar Vehículos',
    description: 'Administrar la flota de vehículos',
    icon: Truck,
    onClick: () => navigate('/admin/vehicles'),
    color: 'bg-indigo-500 hover:bg-indigo-600',
  },
  {
    title: 'Configuración de Precios',
    description: 'Gestionar tarifas y precios',
    icon: DollarSign,
    onClick: () => navigate('/admin/pricing'),
    color: 'bg-green-500 hover:bg-green-600',
  },
];

