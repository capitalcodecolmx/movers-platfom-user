// =====================================================
// HOOK PARA MANEJAR MENSAJES DE ÓRDENES
// =====================================================

import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export interface OrderMessage {
  id: string;
  order_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  attachments?: any;
  is_read: boolean;
  created_at: string;
  // Datos adicionales del remitente
  sender?: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  };
}

export const useOrderMessages = (orderId?: string) => {
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener mensajes de una orden específica
  const fetchOrderMessages = async (orderId: string) => {
    if (!orderId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (
            id,
            full_name,
            email,
            role
          )
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (err: any) {
      console.error('Error fetching order messages:', err);
      setError(err.message || 'Error al cargar mensajes');
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar un nuevo mensaje
  const sendMessage = async (
    orderId: string,
    recipientId: string,
    message: string,
    messageType: 'text' | 'image' | 'file' = 'text',
    attachments?: any
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          order_id: orderId,
          sender_id: user.id,
          recipient_id: recipientId,
          message,
          message_type: messageType,
          attachments,
          is_read: false
        }])
        .select(`
          *,
          sender:sender_id (
            id,
            full_name,
            email,
            role
          )
        `)
        .single();

      if (error) throw error;

      // Agregar el nuevo mensaje a la lista local
      setMessages(prev => [...prev, data]);

      return data;
    } catch (err: any) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  // Marcar mensajes como leídos
  const markAsRead = async (messageIds: string[]) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', messageIds);

      if (error) throw error;

      // Actualizar estado local
      setMessages(prev => 
        prev.map(message => 
          messageIds.includes(message.id) 
            ? { ...message, is_read: true }
            : message
        )
      );
    } catch (err: any) {
      console.error('Error marking messages as read:', err);
      throw err;
    }
  };

  // Obtener información del destinatario (admin o repartidor)
  const getRecipientInfo = async (orderId: string) => {
    try {
      // Obtener información de la orden para saber quién es el destinatario
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          user_id,
          assigned_repartidor_id,
          users:user_id (
            id,
            full_name,
            email,
            role
          )
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      // Si hay un repartidor asignado, el destinatario es el repartidor
      // Si no, el destinatario es el admin
      if (order.assigned_repartidor_id) {
        const { data: repartidor, error: repartidorError } = await supabase
          .from('users')
          .select('id, full_name, email, role')
          .eq('id', order.assigned_repartidor_id)
          .single();

        if (repartidorError) throw repartidorError;
        return repartidor;
      } else {
        // Buscar un admin
        const { data: admin, error: adminError } = await supabase
          .from('users')
          .select('id, full_name, email, role')
          .eq('role', 'admin')
          .limit(1)
          .single();

        if (adminError) throw adminError;
        return admin;
      }
    } catch (err: any) {
      console.error('Error getting recipient info:', err);
      return null;
    }
  };

  // Cargar mensajes cuando cambia el orderId
  useEffect(() => {
    if (orderId) {
      fetchOrderMessages(orderId);
    }
  }, [orderId]);

  // Escuchar cambios en tiempo real
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order_messages_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          const newMessage = payload.new as OrderMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          const updatedMessage = payload.new as OrderMessage;
          setMessages(prev => 
            prev.map(message => 
              message.id === updatedMessage.id 
                ? updatedMessage 
                : message
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return {
    messages,
    isLoading,
    error,
    fetchOrderMessages,
    sendMessage,
    markAsRead,
    getRecipientInfo
  };
};


