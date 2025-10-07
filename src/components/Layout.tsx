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
    { name: 'Mis Órdenes', href: '/orders', icon: MdInventory },
    { name: 'Crear Orden', href: '/orders/create', icon: MdAdd },
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
      {/* Sidebar móvil */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-2xl">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">Mouvers</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-4" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <MdPerson className="w-4 h-4 text-gray-600" />
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
              className="flex items-center w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
            >
              <MdLogout className="w-4 h-4 mr-3" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-50">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-6">
            <span className="text-2xl font-bold text-gray-900">Mouvers</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-4" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <MdPerson className="w-4 h-4 text-gray-600" />
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
              className="flex items-center w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
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
        <div className={`z-40 ${
          location.pathname === '/dashboard' 
            ? 'absolute inset-x-0 top-0 bg-transparent border-transparent' 
            : 'sticky top-0 bg-white border-b border-gray-200'
        }`}>
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden ${
                  location.pathname === '/dashboard' 
                    ? 'text-white/70 hover:text-white' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <MdMenu className="w-6 h-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className={`text-xl font-semibold ${
                  location.pathname === '/dashboard' 
                    ? 'text-white' 
                    : 'text-gray-900'
                }`}>
                  {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notificaciones */}
              <NotificationsDropdown 
                className={`${
                  location.pathname === '/dashboard'
                    ? 'text-white/70 hover:text-white'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              />

              {/* Perfil */}
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  location.pathname === '/dashboard'
                    ? 'bg-white/20'
                    : 'bg-gray-100'
                }`}>
                  <MdPerson className={`w-4 h-4 ${
                    location.pathname === '/dashboard'
                      ? 'text-white'
                      : 'text-gray-600'
                  }`} />
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium ${
                    location.pathname === '/dashboard'
                      ? 'text-white'
                      : 'text-gray-900'
                  }`}>
                    {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'}
                  </p>
                  <p className={`text-xs ${
                    location.pathname === '/dashboard'
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


