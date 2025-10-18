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
    file?: File
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      let attachments = null;

      // Si hay un archivo, subirlo a Supabase Storage
      if (file && messageType === 'file') {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        // Usar auth.uid() como primer nivel para cumplir con la política RLS
        const filePath = `${user.id}/${orderId}/${fileName}`;

        // Subir archivo a Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          throw new Error(`Error al subir el archivo: ${uploadError.message}`);
        }

        // Obtener URL pública del archivo
        const { data: urlData } = supabase.storage
          .from('attachments')
          .getPublicUrl(filePath);

        attachments = {
          file_name: file.name,
          file_path: filePath,
          file_url: urlData.publicUrl,
          file_size: file.size,
          file_type: file.type
        };
      }

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

      // No agregar aquí porque el listener de tiempo real lo hará
      // setMessages(prev => [...prev, data]);

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
        async (payload) => {
          const newMessage = payload.new as OrderMessage;
          
          // Verificar que el mensaje no esté ya en la lista (evitar duplicados)
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            return [...prev, newMessage];
          });

          // Si no tiene información del sender, obtenerla de forma asíncrona
          if (!newMessage.sender) {
            try {
              const { data: senderData } = await supabase
                .from('users')
                .select('id, full_name, email, role')
                .eq('id', newMessage.sender_id)
                .single();
              
              if (senderData) {
                // Actualizar el mensaje con la información del sender
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === newMessage.id 
                      ? { ...msg, sender: senderData }
                      : msg
                  )
                );
              }
            } catch (error) {
              console.error('Error fetching sender data:', error);
            }
          }
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


