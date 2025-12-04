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

  // Redirigir admins al dashboard de administración
  useEffect(() => {
    if (!roleLoading && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, roleLoading, navigate]);

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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      {/* Versión móvil - Visible solo en pantallas pequeñas */}
      <div className="block md:hidden">
        <MobileDashboard user={user} />
      </div>

      {/* Versión desktop - Visible solo en pantallas grandes */}
      <div className="hidden md:block">
        {/* Hero Section con gradiente limpio y patrón sutil */}
        <div className="relative h-[500px] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600">
          {/* Patrón de fondo sutil */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>

          {/* Overlay sutil para mejorar legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>

          {/* Contenido del hero */}
          <div className="relative z-10 h-full flex items-start pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold mb-2 drop-shadow-lg text-white">
                  Dashboard
                </h1>
                <p className="text-lg text-white/95 font-medium drop-shadow-md">
                  Gestiona tus envíos de manera fácil y rápida
                </p>
              </div>

              {/* Estadísticas integradas en el hero */}
              <DashboardStats user={user} />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Órdenes recientes con datos reales */}
          <RecentOrders orders={stats.recentOrders} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


