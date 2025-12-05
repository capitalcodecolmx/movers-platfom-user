// =====================================================
// PÁGINA PRINCIPAL DEL DASHBOARD - ESTILO APPLE
// =====================================================

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Search } from 'lucide-react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { useUserRole } from '../hooks/useUserRole';
import DashboardStats from '../components/DashboardStats';
import RecentOrders from '../components/RecentOrders';
import DashboardSkeleton from '../components/DashboardSkeleton';
import MobileDashboard from '../components/MobileDashboard';
import { useDashboardStats } from '../hooks/useDashboardStats';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { stats, isLoading } = useDashboardStats();

  // NO redirigir admins aquí - DashboardRedirect en main.tsx ya maneja esto
  // Esto previene loops de redirección

  const mainActions = [
    {
      id: 'crear-orden',
      title: 'Hacer Pedido',
      description: 'Solicita un nuevo envío de paquete',
      icon: Plus,
      color: 'bg-gray-200',
      hoverColor: 'hover:bg-gray-300',
      iconColor: 'text-gray-600',
      backgroundImage: '/crear.webp',
      onClick: () => navigate('/orders/create'),
    },
    {
      id: 'mis-ordenes',
      title: 'Mis Pedidos',
      description: 'Gestiona y revisa todos tus envíos',
      icon: Package,
      color: 'bg-gray-200',
      hoverColor: 'hover:bg-gray-300',
      iconColor: 'text-gray-600',
      backgroundImage: '/orders.webp',
      onClick: () => navigate('/orders'),
    },
    {
      id: 'seguimiento',
      title: 'Seguimiento',
      description: 'Rastrea el estado de tus envíos',
      icon: Search,
      color: 'bg-gray-200',
      hoverColor: 'hover:bg-gray-300',
      iconColor: 'text-gray-600',
      backgroundImage: '/seguimiento.webp',
      onClick: () => navigate('/tracking'),
    },
  ];


  // Mostrar skeleton mientras carga
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      {/* Mobile-first dashboard */}
      <div className="lg:hidden">
        <MobileDashboard user={user} />
      </div>

      {/* Desktop / large screens */}
      <div className="hidden lg:block min-h-screen bg-gray-100">
        {/* Admin-style Header for User Dashboard */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Package className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded-full">
                    Panel de Control
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-white">
                  ¡Hola, {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'}! 👋
                </h1>
                <p className="text-slate-400 mt-1">Gestiona tus envíos de manera fácil y rápida</p>
              </div>
              <div className="hidden sm:flex sm:items-center sm:space-x-3">
                <button
                  onClick={() => navigate('/orders/create')}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-indigo-900/20"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Nuevo Pedido
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Estadísticas */}
          <DashboardStats user={user} />

          {/* Órdenes recientes */}
          <div className="mt-8">
            <RecentOrders orders={stats.recentOrders} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </>
  );
}
;

export default DashboardPage;


