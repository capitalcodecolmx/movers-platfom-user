// =====================================================
// HOOK PARA SEGUIMIENTO DE ÓRDENES
// =====================================================

import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export interface TrackingStep {
  id: string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
  completed?: boolean;
  current?: boolean;
  location?: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  notes?: string;
}

export interface TrackingData {
  order: {
    id: string;
    tracking_code: string;
    status: string;
    package_data: any;
    pickup_address: any;
    delivery_address: any;
    pickup_contact: any;
    delivery_contact: any;
    estimated_cost: number;
    created_at: string;
    updated_at: string;
  };
  steps: TrackingStep[];
  currentStep: number;
  progress: number;
}

export const useTracking = () => {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusSteps = (status: string) => {
    const allSteps = [
      {
        id: 'pending',
        status: 'pending',
        title: 'Orden Creada',
        description: 'Tu orden ha sido creada y está siendo procesada',
      },
      {
        id: 'quote_pending',
        status: 'quote_pending',
        title: 'Cotización Pendiente',
        description: 'Estamos calculando el costo de tu envío',
      },
      {
        id: 'quote_ready',
        status: 'quote_ready',
        title: 'Cotización Lista',
        description: 'Tu cotización está lista, revisa el costo',
      },
      {
        id: 'payment_pending',
        status: 'payment_pending',
        title: 'Pago Pendiente',
        description: 'Esperando confirmación de pago',
      },
      {
        id: 'payment_confirmed',
        status: 'payment_confirmed',
        title: 'Pago Confirmado',
        description: 'Pago recibido, procesando tu envío',
      },
      {
        id: 'processing',
        status: 'processing',
        title: 'En Procesamiento',
        description: 'Estamos preparando tu envío',
      },
      {
        id: 'assigned',
        status: 'assigned',
        title: 'Asignada',
        description: 'Hemos asignado un repartidor a tu envío',
      },
      {
        id: 'picked_up',
        status: 'picked_up',
        title: 'Recogida',
        description: 'Tu paquete ha sido recogido',
      },
      {
        id: 'in_transit',
        status: 'in_transit',
        title: 'En Tránsito',
        description: 'Tu paquete está en camino',
      },
      {
        id: 'delivered',
        status: 'delivered',
        title: 'Entregada',
        description: 'Tu paquete ha sido entregado',
      },
    ];

    const statusOrder = [
      'pending', 
      'quote_pending', 
      'quote_ready', 
      'payment_pending', 
      'payment_confirmed',
      'processing', 
      'assigned', 
      'picked_up', 
      'in_transit', 
      'delivered'
    ];
    const currentIndex = statusOrder.indexOf(status);
    
    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
      timestamp: new Date().toISOString(),
      location: undefined,
      notes: undefined,
    }));
  };

  const getCurrentStepIndex = (status: string) => {
    const statusOrder = [
      'pending', 
      'quote_pending', 
      'quote_ready', 
      'payment_pending', 
      'payment_confirmed',
      'processing', 
      'assigned', 
      'picked_up', 
      'in_transit', 
      'delivered'
    ];
    return statusOrder.indexOf(status);
  };

  const getProgress = (status: string) => {
    const statusOrder = [
      'pending', 
      'quote_pending', 
      'quote_ready', 
      'payment_pending', 
      'payment_confirmed',
      'processing', 
      'assigned', 
      'picked_up', 
      'in_transit', 
      'delivered'
    ];
    const currentIndex = statusOrder.indexOf(status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const searchByTrackingCode = async (trackingCode: string) => {
    if (!trackingCode.trim()) {
      setError('Por favor ingresa un código de seguimiento');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      // Buscar la orden por código de seguimiento
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('tracking_code', trackingCode.trim().toUpperCase())
        .single();

      if (orderError) {
        if (orderError.code === 'PGRST116') {
          setError('No se encontró ninguna orden con ese código de seguimiento');
        } else {
          setError('Error al buscar la orden: ' + orderError.message);
        }
        return;
      }

      // Obtener el historial de seguimiento
      const { data: trackingHistory, error: trackingError } = await supabase
        .from('order_tracking')
        .select('*')
        .eq('order_id', order.id)
        .order('created_at', { ascending: true });

      if (trackingError) {
        console.error('Error al obtener historial de seguimiento:', trackingError);
      }

      // Generar pasos de seguimiento
      const steps = getStatusSteps(order.status);
      
      // Si hay historial de seguimiento, actualizar los pasos con timestamps reales
      if (trackingHistory && trackingHistory.length > 0) {
        trackingHistory.forEach((entry, index) => {
          if (steps[index]) {
            steps[index].timestamp = entry.created_at;
            if (entry.location) {
              steps[index].location = entry.location;
            }
            if (entry.notes) {
              steps[index].notes = entry.notes;
            }
          }
        });
      }

      const trackingData: TrackingData = {
        order,
        steps,
        currentStep: getCurrentStepIndex(order.status),
        progress: getProgress(order.status),
      };

      setTrackingData(trackingData);
    } catch (error: any) {
      console.error('Error en searchByTrackingCode:', error);
      setError('Error inesperado: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTracking = () => {
    setTrackingData(null);
    setError(null);
  };

  return {
    trackingData,
    isLoading,
    error,
    searchByTrackingCode,
    clearTracking,
  };
};