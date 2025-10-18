// =====================================================
// HOOK PARA MANEJO DE NOTIFICACIONES
// =====================================================

import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export interface Notification {
  id: string;
  user_id: string;
  order_id?: string;
  type: 'order_created' | 'order_processed' | 'order_assigned' | 'order_picked_up' | 'order_in_transit' | 'order_delivered' | 'order_cancelled' | 'payment_confirmed' | 'payment_failed' | 'quote_ready' | 'admin_message';
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Obtener notificaciones del usuario actual
  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Usuario no autenticado');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Error al cargar notificaciones');
    } finally {
      setIsLoading(false);
    }
  };

  // Crear una nueva notificación
  const createNotification = async (notificationData: {
    user_id: string;
    order_id?: string;
    type: Notification['type'];
    title: string;
    message: string;
    data?: any;
  }) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationData])
        .select()
        .single();

      if (error) throw error;

      // Actualizar la lista local solo si no existe ya
      setNotifications(prev => {
        const exists = prev.some(n => n.id === data.id);
        if (exists) return prev;
        return [data, ...prev];
      });
      
      // Actualizar contador de no leídas si es para el usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (user && notificationData.user_id === user.id && !data.is_read) {
        setUnreadCount(prev => prev + 1);
      }

      return data;
    } catch (err: any) {
      console.error('Error creating notification:', err);
      throw err;
    }
  };

  // Marcar notificación como leída
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  };

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  };

  // Función para crear notificaciones automáticas por tipo de evento
  const createOrderNotification = async (
    orderId: string, 
    userId: string, 
    eventType: 'created' | 'processed' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled'
  ) => {
    const notificationTemplates = {
      created: {
        type: 'order_created' as const,
        title: 'Nueva orden creada',
        message: 'Tu orden ha sido creada exitosamente y está siendo procesada.'
      },
      processed: {
        type: 'order_processed' as const,
        title: 'Orden en procesamiento',
        message: 'Tu orden está siendo preparada para el envío.'
      },
      assigned: {
        type: 'order_assigned' as const,
        title: 'Repartidor asignado',
        message: 'Hemos asignado un repartidor a tu envío.'
      },
      picked_up: {
        type: 'order_picked_up' as const,
        title: 'Paquete recogido',
        message: 'Tu paquete ha sido recogido y está en camino.'
      },
      in_transit: {
        type: 'order_in_transit' as const,
        title: 'Envío en tránsito',
        message: 'Tu paquete está en camino a su destino.'
      },
      delivered: {
        type: 'order_delivered' as const,
        title: 'Envío entregado',
        message: 'Tu paquete ha sido entregado exitosamente.'
      },
      cancelled: {
        type: 'order_cancelled' as const,
        title: 'Orden cancelada',
        message: 'Tu orden ha sido cancelada.'
      }
    };

    const template = notificationTemplates[eventType];
    
    return await createNotification({
      user_id: userId,
      order_id: orderId,
      type: template.type,
      title: template.title,
      message: template.message,
      data: { order_id: orderId, event_type: eventType }
    });
  };

  // Escuchar cambios en tiempo real
  useEffect(() => {
    let channel: any = null;
    
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel(`notifications_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            
            // Verificar que no esté ya en la lista (evitar duplicados)
            setNotifications(prev => {
              const exists = prev.some(n => n.id === newNotification.id);
              if (exists) return prev;
              
              return [newNotification, ...prev];
            });
            
            if (!newNotification.is_read) {
              setUnreadCount(prev => prev + 1);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const updatedNotification = payload.new as Notification;
            const oldNotification = payload.old as Notification;
            
            setNotifications(prev => 
              prev.map(notification => 
                notification.id === updatedNotification.id 
                  ? updatedNotification 
                  : notification
              )
            );
            
            // Actualizar contador de no leídas
            if (oldNotification.is_read !== updatedNotification.is_read) {
              setUnreadCount(prev => {
                if (!oldNotification.is_read && updatedNotification.is_read) {
                  return Math.max(0, prev - 1); // Marcada como leída
                } else if (oldNotification.is_read && !updatedNotification.is_read) {
                  return prev + 1; // Marcada como no leída
                }
                return prev;
              });
            }
          }
        )
        .subscribe();
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    fetchNotifications,
    createNotification,
    createOrderNotification,
    markAsRead,
    markAllAsRead
  };
};
