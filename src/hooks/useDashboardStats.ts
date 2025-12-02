// =====================================================
// HOOK PARA ESTADÍSTICAS DEL DASHBOARD
// =====================================================

import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  inTransit: number;
  delivered: number;
  pending: number;
  cancelled: number;
  totalSpent: number;
  thisMonthSpent: number;
  averageOrderValue: number;
  recentOrders: any[];
  // Business-specific metrics
  shippingOrders: number;
  ecommerceOrders: number;
  serviceTypeBreakdown: {
    ftl: number;
    ltl: number;
    lastMile: number;
    ecommerce: number;
  };
  priorityBreakdown: {
    economico: number;
    estandar: number;
    urgente: number;
  };
  quotePending: number;
  quoteReady: number;
  paymentPending: number;
  paymentConfirmed: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeOrders: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0,
    cancelled: 0,
    totalSpent: 0,
    thisMonthSpent: 0,
    averageOrderValue: 0,
    recentOrders: [],
    shippingOrders: 0,
    ecommerceOrders: 0,
    serviceTypeBreakdown: {
      ftl: 0,
      ltl: 0,
      lastMile: 0,
      ecommerce: 0,
    },
    priorityBreakdown: {
      economico: 0,
      estandar: 0,
      urgente: 0,
    },
    quotePending: 0,
    quoteReady: 0,
    paymentPending: 0,
    paymentConfirmed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar autenticación
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error('Error de autenticación: ' + authError.message);
      }
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Obtener todas las órdenes del usuario
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw new Error('Error al obtener órdenes: ' + ordersError.message);
      }

      const ordersList = orders || [];

      // Calcular estadísticas básicas
      const totalOrders = ordersList.length;
      const activeOrders = ordersList.filter(order => 
        ['pending', 'processing', 'assigned', 'picked_up', 'in_transit', 'quote_pending', 'quote_ready'].includes(order.status)
      ).length;
      
      const inTransit = ordersList.filter(order => order.status === 'in_transit').length;
      const delivered = ordersList.filter(order => order.status === 'delivered').length;
      const pending = ordersList.filter(order => order.status === 'pending').length;
      const cancelled = ordersList.filter(order => order.status === 'cancelled').length;
      const quotePending = ordersList.filter(order => order.status === 'quote_pending').length;
      const quoteReady = ordersList.filter(order => order.status === 'quote_ready').length;
      const paymentPending = ordersList.filter(order => order.payment_status === 'pending').length;
      const paymentConfirmed = ordersList.filter(order => order.payment_status === 'paid').length;

      // Diferenciar entre órdenes de envío y ecommerce
      const shippingOrders = ordersList.filter(order => {
        const packageData = order.package_data || {};
        return packageData.service_type !== 'ecommerce' && packageData.service_type;
      }).length;
      
      const ecommerceOrders = ordersList.filter(order => {
        const packageData = order.package_data || {};
        return packageData.service_type === 'ecommerce';
      }).length;

      // Desglose por tipo de servicio
      const serviceTypeBreakdown = {
        ftl: ordersList.filter(order => {
          const packageData = order.package_data || {};
          return packageData.service_type === 'ftl';
        }).length,
        ltl: ordersList.filter(order => {
          const packageData = order.package_data || {};
          return packageData.service_type === 'ltl';
        }).length,
        lastMile: ordersList.filter(order => {
          const packageData = order.package_data || {};
          return packageData.service_type === 'last-mile';
        }).length,
        ecommerce: ecommerceOrders,
      };

      // Desglose por prioridad (solo para órdenes de envío)
      const priorityBreakdown = {
        economico: ordersList.filter(order => {
          const packageData = order.package_data || {};
          return packageData.priority === 'economico';
        }).length,
        estandar: ordersList.filter(order => {
          const packageData = order.package_data || {};
          return packageData.priority === 'estandar';
        }).length,
        urgente: ordersList.filter(order => {
          const packageData = order.package_data || {};
          return packageData.priority === 'urgente';
        }).length,
      };

      // Calcular gastos
      const totalSpent = ordersList.reduce((sum, order) => {
        return sum + (order.final_cost || order.estimated_cost || 0);
      }, 0);

      // Gastos del mes actual
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthSpent = ordersList
        .filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        })
        .reduce((sum, order) => {
          return sum + (order.final_cost || order.estimated_cost || 0);
        }, 0);

      const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

      // Órdenes recientes (últimas 5)
      const recentOrders = ordersList.slice(0, 5);

      setStats({
        totalOrders,
        activeOrders,
        inTransit,
        delivered,
        pending,
        cancelled,
        totalSpent,
        thisMonthSpent,
        averageOrderValue,
        recentOrders,
        shippingOrders,
        ecommerceOrders,
        serviceTypeBreakdown,
        priorityBreakdown,
        quotePending,
        quoteReady,
        paymentPending,
        paymentConfirmed,
      });

    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Error al obtener estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  };
};
