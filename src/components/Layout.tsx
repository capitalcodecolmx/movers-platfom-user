// =====================================================
// LAYOUT PRINCIPAL CON SIDEBAR MINIMALISTA PROFUNDO
// Updated to support distinct Admin Sidebar
// =====================================================

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdInventory,
  MdAdd,
  MdSearch,
  MdPerson,
  MdLogout,
  MdMenu,
  MdClose,
  MdPeople,
  MdLocalShipping,
  MdSettings,
  MdShoppingBag
} from 'react-icons/md';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { useUserRole } from '../hooks/useUserRole';
import { COMPANY_INFO } from '../data/mockData';
import WhatsAppChat from './WhatsAppChat';
import NotificationsDropdown from './NotificationsDropdown';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation for regular users
  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: MdDashboard },
    { name: 'Mis Pedidos', href: '/orders', icon: MdInventory },
    { name: 'Hacer Pedido', href: '/orders/create', icon: MdAdd },
    { name: 'Seguimiento', href: '/tracking', icon: MdSearch },
  ];

  // Navigation for admins
  const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: MdDashboard },
    { name: 'Órdenes', href: '/admin/orders', icon: MdInventory },
    { name: 'Usuarios', href: '/admin/users', icon: MdPeople },
    { name: 'Vehículos', href: '/admin/vehicles', icon: MdLocalShipping },
    { name: 'Productos', href: '/admin/products', icon: MdShoppingBag },
    { name: 'Configuración', href: '/admin/settings', icon: MdSettings },
  ];

  const navigation = isAdmin ? adminNavigation : userNavigation;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    // For admin/orders, we want to keep it active even if it has query params
    if (path === '/admin/orders' && location.pathname === '/admin/orders') {
      return true;
    }
    return location.pathname === path;
  };

  // Styles - Unified Dark Theme for ALL users (Admin & User)
  const sidebarBg = 'bg-slate-900 border-slate-800';

  const sidebarHeaderBg = 'bg-slate-900';

  const navItemActive = 'bg-slate-800 text-cyan-400 border-l-4 border-cyan-500';

  const navItemInactive = 'text-slate-400 hover:bg-slate-800 hover:text-white';

  const mobileHeaderBg = 'bg-slate-900';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar móvil */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className={`fixed inset-y-0 left-0 flex w-64 flex-col shadow-2xl bg-slate-900`}>
          {/* Header con branding */}
          <div className={`flex h-16 items-center justify-between px-6 ${mobileHeaderBg}`}>
            <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center">
              <img
                src={COMPANY_INFO.logo}
                alt={COMPANY_INFO.name}
                className="h-10 w-auto brightness-0 invert drop-shadow-sm"
              />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.href) ? navItemActive : navItemInactive
                  }`}
              >
                <item.icon className={`w-5 h-5 mr-4 ${isActive(item.href)
                  ? (isAdmin ? 'text-cyan-400' : 'text-cyan-600')
                  : ''
                  }`} />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-slate-800 bg-slate-900">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${isAdmin ? 'bg-slate-800' : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                }`}>
                <MdPerson className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isAdmin ? 'text-white' : 'text-gray-900'}`}>
                  {user?.user_metadata?.full_name || 'Usuario'}
                </p>
                <p className={`text-xs truncate ${isAdmin ? 'text-slate-400' : 'text-gray-500'}`}>
                  {isAdmin ? 'Administrador' : user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm rounded-lg transition-all duration-200 border text-slate-400 hover:bg-slate-800 hover:text-red-400 border-slate-700"
            >
              <MdLogout className="w-4 h-4 mr-3" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-40">
        <div className={`flex flex-col flex-grow border-r shadow-lg ${sidebarBg}`}>
          {/* Header con branding */}
          <div className={`flex h-16 items-center justify-center px-6 shadow-md ${sidebarHeaderBg}`}>
            <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center group">
              <img
                src={COMPANY_INFO.logo}
                alt={COMPANY_INFO.name}
                className="h-12 w-auto brightness-0 invert drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          <nav className={`flex-1 px-4 py-6 space-y-1 bg-slate-900`}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.href) ? navItemActive : navItemInactive
                  }`}
              >
                <item.icon className={`w-5 h-5 mr-4 ${isActive(item.href)
                  ? (isAdmin ? 'text-cyan-400' : 'text-cyan-600')
                  : ''
                  }`} />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-slate-800 bg-slate-900">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-slate-800">
                <MdPerson className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">
                  {user?.user_metadata?.full_name || 'Usuario'}
                </p>
                <p className="text-xs truncate text-slate-400">
                  {isAdmin ? 'Administrador' : user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm rounded-lg transition-all duration-200 border text-slate-400 hover:bg-slate-800 hover:text-red-400 border-slate-700"
            >
              <MdLogout className="w-4 h-4 mr-3" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={`lg:pl-64 relative ${isAdmin ? 'bg-gray-100' : ''}`}>
        {/* Top bar - Solo para usuarios no-admin dentro de su dashboard que quieran transparencia */}
        {/* Para admin, queremos que sea sólido o combine con el header */}

        <div className={`z-40 sticky top-0 bg-slate-900 border-b border-slate-800 lg:hidden`}>
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden ${location.pathname === '/dashboard' && !isAdmin
                  ? 'text-white/70 hover:text-white'
                  : isAdmin ? 'text-white hover:text-cyan-400' : 'text-cyan-600 hover:text-cyan-700'
                  }`}
              >
                <MdMenu className="w-6 h-6" />
              </button>

              {/* Logo en mobile/tablet cuando no es dashboard home y no es admin (ya que admin tiene header oscuro) */}
              {location.pathname !== '/dashboard' && !isAdmin && (
                <Link to="/dashboard" className="lg:hidden">
                  <img
                    src={COMPANY_INFO.logo}
                    alt={COMPANY_INFO.name}
                    className="h-8 w-auto"
                  />
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Notificaciones */}
              <NotificationsDropdown
                className={`${location.pathname === '/dashboard' && !isAdmin
                  ? 'text-white/70 hover:text-white'
                  : isAdmin ? 'text-slate-300 hover:text-white' : 'text-cyan-600 hover:text-cyan-700'
                  }`}
              />

              {/* Perfil (Solo mostrar si no es admin, porque admin ya tiene su header en DashboardPage) */}
              {!isAdmin && (
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${location.pathname === '/dashboard'
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-md'
                    }`}>
                    <MdPerson className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-sm font-medium ${location.pathname === '/dashboard' ? 'text-white' : 'text-gray-900'
                      }`}>
                      {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'}
                    </p>
                    <p className={`text-xs ${location.pathname === '/dashboard' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                      {user?.user_metadata?.role === 'user' ? 'Cliente' : user?.user_metadata?.role}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Chat flotante de WhatsApp */}
      <WhatsAppChat />
    </div>
  );
};

export default Layout;


