// =====================================================
// SERVICIO DE NOTIFICACIONES
// =====================================================

import { supabase } from '../config/supabase';
import type { Notification } from '../hooks/useNotifications';

export class NotificationService {
  // Crear notificación cuando se crea una orden
  static async notifyOrderCreated(orderId: string, userId: string, trackingCode: string) {
    try {
      const notification = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          order_id: orderId,
          type: 'order_created',
          title: 'Nueva orden creada',
          message: `Tu orden ${trackingCode} ha sido creada exitosamente y está siendo procesada.`,
          data: {
            order_id: orderId,
            tracking_code: trackingCode,
            event_type: 'order_created'
          }
        }])
        .select()
        .single();

      if (notification.error) throw notification.error;
      return notification.data;
    } catch (error) {
      console.error('Error creating order creation notification:', error);
      throw error;
    }
  }

  // Crear notificación cuando se actualiza el estado de una orden
  static async notifyOrderStatusChange(
    orderId: string, 
    userId: string, 
    status: string, 
    trackingCode: string,
    additionalData?: any
  ) {
    const statusMessages = {
      'processing': {
        type: 'order_processed' as const,
        title: 'Orden en procesamiento',
        message: `Tu orden ${trackingCode} está siendo preparada para el envío.`
      },
      'assigned': {
        type: 'order_assigned' as const,
        title: 'Repartidor asignado',
        message: `Hemos asignado un repartidor a tu orden ${trackingCode}.`
      },
      'picked_up': {
        type: 'order_picked_up' as const,
        title: 'Paquete recogido',
        message: `Tu paquete ${trackingCode} ha sido recogido y está en camino.`
      },
      'in_transit': {
        type: 'order_in_transit' as const,
        title: 'Envío en tránsito',
        message: `Tu paquete ${trackingCode} está en camino a su destino.`
      },
      'delivered': {
        type: 'order_delivered' as const,
        title: 'Envío entregado',
        message: `¡Tu paquete ${trackingCode} ha sido entregado exitosamente!`
      },
      'cancelled': {
        type: 'order_cancelled' as const,
        title: 'Orden cancelada',
        message: `Tu orden ${trackingCode} ha sido cancelada.`
      }
    };

    const statusInfo = statusMessages[status as keyof typeof statusMessages];
    if (!statusInfo) return null;

    try {
      const notification = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          order_id: orderId,
          type: statusInfo.type,
          title: statusInfo.title,
          message: statusInfo.message,
          data: {
            order_id: orderId,
            tracking_code: trackingCode,
            status: status,
            event_type: 'status_change',
            ...additionalData
          }
        }])
        .select()
        .single();

      if (notification.error) throw notification.error;
      return notification.data;
    } catch (error) {
      console.error('Error creating status change notification:', error);
      throw error;
    }
  }

  // Crear notificación de pago
  static async notifyPaymentStatus(
    orderId: string,
    userId: string,
    paymentStatus: 'confirmed' | 'failed',
    trackingCode: string,
    amount?: number
  ) {
    const paymentMessages = {
      confirmed: {
        type: 'payment_confirmed' as const,
        title: 'Pago confirmado',
        message: `El pago de tu orden ${trackingCode} ha sido confirmado${amount ? ` por $${amount}` : ''}.`
      },
      failed: {
        type: 'payment_failed' as const,
        title: 'Error en el pago',
        message: `Hubo un problema con el pago de tu orden ${trackingCode}. Por favor, verifica tu método de pago.`
      }
    };

    const paymentInfo = paymentMessages[paymentStatus];
    if (!paymentInfo) return null;

    try {
      const notification = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          order_id: orderId,
          type: paymentInfo.type,
          title: paymentInfo.title,
          message: paymentInfo.message,
          data: {
            order_id: orderId,
            tracking_code: trackingCode,
            payment_status: paymentStatus,
            amount: amount,
            event_type: 'payment_update'
          }
        }])
        .select()
        .single();

      if (notification.error) throw notification.error;
      return notification.data;
    } catch (error) {
      console.error('Error creating payment notification:', error);
      throw error;
    }
  }

  // Crear notificación de cotización lista
  static async notifyQuoteReady(orderId: string, userId: string, trackingCode: string, cost: number) {
    try {
      const notification = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          order_id: orderId,
          type: 'quote_ready',
          title: 'Cotización lista',
          message: `Tu cotización para la orden ${trackingCode} está lista. Costo estimado: $${cost.toFixed(2)}`,
          data: {
            order_id: orderId,
            tracking_code: trackingCode,
            estimated_cost: cost,
            event_type: 'quote_ready'
          }
        }])
        .select()
        .single();

      if (notification.error) throw notification.error;
      return notification.data;
    } catch (error) {
      console.error('Error creating quote notification:', error);
      throw error;
    }
  }

  // Crear mensaje de administrador
  static async notifyAdminMessage(
    userId: string,
    orderId: string | null,
    title: string,
    message: string,
    additionalData?: any
  ) {
    try {
      const notification = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          order_id: orderId,
          type: 'admin_message',
          title,
          message,
          data: {
            order_id: orderId,
            event_type: 'admin_message',
            ...additionalData
          }
        }])
        .select()
        .single();

      if (notification.error) throw notification.error;
      return notification.data;
    } catch (error) {
      console.error('Error creating admin message notification:', error);
      throw error;
    }
  }

  // Obtener notificaciones de un usuario
  static async getUserNotifications(userId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Notification[];
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  // Marcar notificación como leída
  static async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Marcar todas las notificaciones como leídas
  static async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Obtener contador de notificaciones no leídas
  static async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }
}


