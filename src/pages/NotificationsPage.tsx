// =====================================================
// PÁGINA DE NOTIFICACIONES
// =====================================================

import React, { useState } from 'react';
import { ArrowLeft, Bell, Package, Truck, CheckCircle, AlertCircle, CreditCard, MessageSquare, Clock, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import Layout from '../components/Layout';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [displayLimit, setDisplayLimit] = useState(20);

  // Obtener icono según el tipo de notificación
  const getNotificationIcon = (type: string, isRead: boolean) => {
    const iconClass = `w-6 h-6 ${isRead ? 'text-gray-400' : ''}`;
    
    switch (type) {
      case 'order_created':
      case 'order_processed':
        return <Package className={`${iconClass} ${!isRead ? 'text-blue-500' : ''}`} />;
      case 'order_assigned':
      case 'order_picked_up':
      case 'order_in_transit':
        return <Truck className={`${iconClass} ${!isRead ? 'text-orange-500' : ''}`} />;
      case 'order_delivered':
        return <CheckCircle className={`${iconClass} ${!isRead ? 'text-green-500' : ''}`} />;
      case 'order_cancelled':
        return <AlertCircle className={`${iconClass} ${!isRead ? 'text-red-500' : ''}`} />;
      case 'payment_confirmed':
      case 'payment_failed':
        return <CreditCard className={`${iconClass} ${!isRead ? 'text-purple-500' : ''}`} />;
      case 'quote_ready':
        return <Clock className={`${iconClass} ${!isRead ? 'text-yellow-500' : ''}`} />;
      case 'admin_message':
        return <MessageSquare className={`${iconClass} ${!isRead ? 'text-gray-600' : ''}`} />;
      default:
        return <Bell className={`${iconClass} ${!isRead ? 'text-gray-500' : ''}`} />;
    }
  };

  // Formatear tiempo relativo
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Hace un momento';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES');
    }
  };

  // Manejar clic en notificación
  const handleNotificationClick = async (notification: any) => {
    // Marcar como leída si no está leída
    if (!notification.is_read) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navegar según el tipo de notificación
    if (notification.order_id) {
      navigate(`/orders/${notification.order_id}`);
    }
  };

  // Manejar marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Filtrar notificaciones
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') {
      return !notification.is_read;
    }
    return true;
  });

  // Notificaciones a mostrar (con límite)
  const displayedNotifications = filteredNotifications.slice(0, displayLimit);
  const hasMore = filteredNotifications.length > displayLimit;

  // Cargar más notificaciones
  const loadMore = () => {
    setDisplayLimit(prev => prev + 20);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
                  <p className="text-gray-600 mt-1">
                    {filter === 'unread' 
                      ? `${unreadCount} notificaciones no leídas`
                      : `${notifications.length} notificaciones totales`
                    }
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              No leídas ({unreadCount})
            </button>
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Cargando notificaciones...</p>
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'unread' ? 'No hay notificaciones no leídas' : 'No tienes notificaciones'}
                </h3>
                <p className="text-gray-500">
                  {filter === 'unread' 
                    ? 'Todas tus notificaciones han sido leídas'
                    : 'Las notificaciones aparecerán aquí cuando tengas actualizaciones'
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200">
                  {displayedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Icono */}
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type, notification.is_read)}
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-lg font-semibold ${
                            !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          
                          <div className="flex items-center space-x-2">
                            {!notification.is_read && (
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            )}
                            <span className="text-sm text-gray-400">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                          </div>
                        </div>
                        
                        <p className={`mt-2 ${
                          !notification.is_read ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>

                        {/* Información adicional si hay datos */}
                        {notification.data && (
                          <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600">
                              {notification.data.tracking_code && (
                                <span className="font-mono text-blue-600">
                                  Código: {notification.data.tracking_code}
                                </span>
                              )}
                              {notification.data.estimated_cost && (
                                <span className="ml-4 text-green-600">
                                  Costo: ${notification.data.estimated_cost}
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
                
                {/* Botón cargar más */}
                {hasMore && (
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={loadMore}
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Cargar más notificaciones ({filteredNotifications.length - displayLimit} restantes)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
