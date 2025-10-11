// =====================================================
// PÁGINA PRINCIPAL DEL DASHBOARD - ESTILO APPLE
// =====================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Search } from 'lucide-react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import DashboardStats from '../components/DashboardStats';
import RecentOrders from '../components/RecentOrders';
import DashboardSkeleton from '../components/DashboardSkeleton';
import MobileDashboard from '../components/MobileDashboard';
import { useDashboardStats } from '../hooks/useDashboardStats';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, isLoading } = useDashboardStats();

  const mainActions = [
    {
      id: 'crear-orden',
      title: 'Crear Orden',
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
      title: 'Mis Órdenes',
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
    <div className="min-h-screen bg-gray-50">
      {/* Versión móvil - Visible solo en pantallas pequeñas */}
      <div className="block md:hidden">
        <MobileDashboard user={user} />
      </div>

      {/* Versión desktop - Visible solo en pantallas grandes */}
      <div className="hidden md:block">
        {/* Hero Section con fondo de imagen */}
        <div 
          className="relative h-[500px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/back.png)' }}
        >
          {/* Overlay para mejorar legibilidad */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Contenido del hero */}
          <div className="relative z-10 h-full flex items-start pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-lg text-white/90">
                  Gestiona tus envíos de manera fácil y rápida
                </p>
              </div>

              {/* Estadísticas integradas en el hero */}
              <DashboardStats user={user} />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Acciones principales */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Acciones principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mainActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className="group relative rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 text-left hover:-translate-y-1 overflow-hidden"
                  style={{
                    backgroundImage: `url(${action.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Overlay negro para mejorar legibilidad */}
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300"></div>
                  
                  {/* Contenido */}
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className={`p-4 rounded-2xl bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className={`w-8 h-8 text-white`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white/90 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-white/80 group-hover:text-white/90 transition-colors leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Órdenes recientes con datos reales */}
          <RecentOrders orders={stats.recentOrders} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


