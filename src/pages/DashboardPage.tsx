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
      color: 'bg-gray-100',
      hoverColor: 'hover:bg-gray-200',
      iconColor: 'text-gray-700',
      backgroundImage: '/crear.webp',
      onClick: () => navigate('/orders/create'),
    },
    {
      id: 'mis-ordenes',
      title: 'Mis Pedidos',
      description: 'Gestiona y revisa todos tus envíos',
      icon: Package,
      color: 'bg-gray-100',
      hoverColor: 'hover:bg-gray-200',
      iconColor: 'text-gray-700',
      backgroundImage: '/orders.webp',
      onClick: () => navigate('/orders'),
    },
    {
      id: 'seguimiento',
      title: 'Seguimiento',
      description: 'Rastrea el estado de tus envíos',
      icon: Search,
      color: 'bg-gray-100',
      hoverColor: 'hover:bg-gray-200',
      iconColor: 'text-gray-700',
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
      <div className="hidden lg:block min-h-screen bg-gray-50">
        {/* Minimalistic Header for User Dashboard */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  ¡Hola, {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'}! 👋
                </h1>
                <p className="text-gray-500 mt-2">Gestiona tus envíos de manera fácil y rápida</p>
              </div>
              <div className="hidden sm:flex sm:items-center">
                <button
                  onClick={() => navigate('/orders/create')}
                  className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
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


