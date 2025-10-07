// =====================================================
// HOOK PARA MANEJAR ÓRDENES
// =====================================================

import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { NotificationService } from '../services/notificationService';

export interface Order {
  id: string;
  tracking_code: string;
  user_id: string;
  status: string;
  package_data: any;
  pickup_address: any;
  delivery_address: any;
  pickup_contact: any;
  delivery_contact: any;
  pickup_date?: string;
  pickup_time?: string;
  delivery_date?: string;
  delivery_time?: string;
  estimated_cost?: number;
  final_cost?: number;
  payment_status: string;
  payment_method?: string;
  payment_reference?: string;
  bank_info?: any;
  assigned_repartidor_id?: string;
  assigned_vehicle_id?: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  admin_notes?: string;
  customer_notes?: string;
  attachments?: any;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear nueva orden
  const createOrder = async (orderData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar autenticación
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error in createOrder:', authError);
        throw new Error('Error de autenticación: ' + authError.message);
      }
      
      if (!user) {
        console.log('No user found in createOrder');
        throw new Error('Usuario no autenticado');
      }

      console.log('Creating order for user:', user.id, 'email:', user.email);

      // Preparar los datos para la base de datos
      const orderPayload = {
        user_id: user.id,
        package_data: {
          type: orderData.packageType,
          description: orderData.packageDescription,
          weight: orderData.weight,
          dimensions: orderData.dimensions,
          value: orderData.packageValue,
          special_instructions: orderData.specialInstructions,
          insurance_required: orderData.insuranceRequired,
          fragile: orderData.fragile,
          urgent: orderData.urgent,
        },
        pickup_address: orderData.pickupAddress,
        delivery_address: orderData.deliveryAddress,
        pickup_contact: orderData.senderInfo || orderData.pickupContact,
        delivery_contact: orderData.recipientInfo || orderData.deliveryContact,
        pickup_date: orderData.pickupDate || null,
        pickup_time: orderData.pickupTime || null,
        delivery_date: orderData.deliveryDate || null,
        delivery_time: orderData.deliveryTime || null,
        estimated_cost: orderData.estimatedCost || null,
        assigned_vehicle_id: orderData.selectedVehicle?.id || null,
        customer_notes: orderData.specialInstructions || null,
      };

      console.log('Creating order with payload:', orderPayload);

      const { data, error } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw error;
      }

      console.log('Order created successfully:', data);

      // Crear notificación de orden creada
      try {
        await NotificationService.notifyOrderCreated(
          data.id, 
          user.id, 
          data.tracking_code
        );
        console.log('Notification created for order:', data.tracking_code);
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // No lanzamos el error para no afectar la creación de la orden
      }

      // Actualizar la lista local
      setOrders(prev => [data, ...prev]);
      
      return data;
    } catch (err: any) {
      setError(err.message || 'Error al crear la orden');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener órdenes del usuario
  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar autenticación
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Error de autenticación: ' + authError.message);
      }
      
      if (!user) {
        console.log('No user found, redirecting to login');
        throw new Error('Usuario no autenticado');
      }

      console.log('Fetching orders for user:', user.id, 'email:', user.email);

      // Obtener órdenes del usuario
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Error al obtener órdenes: ' + error.message);
      }
      
      console.log('Orders fetched successfully:', data?.length || 0, 'orders');
      setOrders(data || []);
    } catch (err: any) {
      console.error('Error in fetchOrders:', err);
      setError(err.message || 'Error al obtener las órdenes');
      setOrders([]); // Limpiar órdenes en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener una orden específica
  const getOrder = async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      
      return data;
    } catch (err: any) {
      setError(err.message || 'Error al obtener la orden');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar estado de la orden
  const updateOrderStatus = async (orderId: string, status: string, additionalData?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Obtener la orden actual para acceder a los datos del usuario
      const { data: currentOrder } = await supabase
        .from('orders')
        .select('user_id, tracking_code')
        .eq('id', orderId)
        .single();

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      // Crear notificación de cambio de estado
      if (currentOrder) {
        try {
          await NotificationService.notifyOrderStatusChange(
            orderId,
            currentOrder.user_id,
            status,
            currentOrder.tracking_code,
            additionalData
          );
          console.log('Status change notification created for order:', currentOrder.tracking_code);
        } catch (notificationError) {
          console.error('Error creating status change notification:', notificationError);
          // No lanzamos el error para no afectar la actualización de la orden
        }
      }

      // Actualizar la lista local
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
      
      return data;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la orden');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar órdenes al montar el componente
  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    isLoading,
    error,
    createOrder,
    fetchOrders,
    getOrder,
    updateOrderStatus,
  };
};
