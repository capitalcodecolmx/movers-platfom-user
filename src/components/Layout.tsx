// =====================================================
// LAYOUT PRINCIPAL CON SIDEBAR MINIMALISTA PROFUNDO
// =====================================================

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdInventory,
  MdAdd,
  MdSearch,
  MdNotifications,
  MdPerson,
  MdLogout,
  MdMenu,
  MdClose
} from 'react-icons/md';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { COMPANY_INFO } from '../data/mockData';
import WhatsAppChat from './WhatsAppChat';
import NotificationsDropdown from './NotificationsDropdown';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: MdDashboard },
    { name: 'Mis Pedidos', href: '/orders', icon: MdInventory },
    { name: 'Hacer Pedido', href: '/orders/create', icon: MdAdd },
    { name: 'Seguimiento', href: '/tracking', icon: MdSearch },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    const isCurrentPath = location.pathname === path;
    console.log(`Checking path: ${path}, current: ${location.pathname}, active: ${isCurrentPath}`);
    return isCurrentPath;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar móvil - Solo visible en pantallas pequeñas */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-2xl">
          {/* Header con branding */}
          <div className="flex h-16 items-center justify-between px-6 bg-gradient-to-r from-cyan-600 to-blue-600">
            <Link to="/dashboard" className="flex items-center">
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
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.href)
                  ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border-l-4 border-cyan-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 hover:text-cyan-700'
                  }`}
              >
                <item.icon className={`w-5 h-5 mr-4 ${isActive(item.href) ? 'text-cyan-600' : ''}`} />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-6 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                <MdPerson className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.user_metadata?.full_name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 rounded-lg transition-all duration-200 border border-gray-200 hover:border-red-200"
            >
              <MdLogout className="w-4 h-4 mr-3" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar desktop - Solo visible en pantallas grandes */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-40">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-lg">
          {/* Header con branding */}
          <div className="flex h-16 items-center justify-center px-6 bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 shadow-md">
            <Link to="/dashboard" className="flex items-center group">
              <img
                src={COMPANY_INFO.logo}
                alt={COMPANY_INFO.name}
                className="h-12 w-auto brightness-0 invert drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 bg-gradient-to-b from-white to-gray-50/50">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.href)
                  ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border-l-4 border-cyan-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 hover:text-cyan-700'
                  }`}
              >
                <item.icon className={`w-5 h-5 mr-4 ${isActive(item.href) ? 'text-cyan-600' : ''}`} />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-6 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                <MdPerson className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.user_metadata?.full_name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 rounded-lg transition-all duration-200 border border-gray-200 hover:border-red-200"
            >
              <MdLogout className="w-4 h-4 mr-3" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="lg:pl-64 relative">
        {/* Top bar */}
        <div className={`z-40 ${location.pathname === '/dashboard'
          ? 'absolute inset-x-0 top-0 bg-transparent border-transparent'
          : 'sticky top-0 bg-gradient-to-r from-white via-cyan-50/30 to-blue-50/30 border-b border-gray-200 backdrop-blur-sm'
          }`}>
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden ${location.pathname === '/dashboard'
                  ? 'text-white/70 hover:text-white'
                  : 'text-cyan-600 hover:text-cyan-700'
                  }`}
              >
                <MdMenu className="w-6 h-6" />
              </button>
              {/* Logo en mobile/tablet cuando no es dashboard */}
              {location.pathname !== '/dashboard' && (
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
                className={`${location.pathname === '/dashboard'
                  ? 'text-white/70 hover:text-white'
                  : 'text-cyan-600 hover:text-cyan-700'
                  }`}
              />

              {/* Perfil */}
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${location.pathname === '/dashboard'
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-md'
                  }`}>
                  <MdPerson className={`w-4 h-4 ${location.pathname === '/dashboard'
                    ? 'text-white'
                    : 'text-white'
                    }`} />
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium ${location.pathname === '/dashboard'
                    ? 'text-white'
                    : 'text-gray-900'
                    }`}>
                    {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'}
                  </p>
                  <p className={`text-xs ${location.pathname === '/dashboard'
                    ? 'text-white/70'
                    : 'text-gray-500'
                    }`}>
                    {user?.user_metadata?.role === 'user' ? 'Cliente' : user?.user_metadata?.role}
                  </p>
                </div>
              </div>
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


