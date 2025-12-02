// =====================================================
// ZUSTAND STORE PARA ADMIN DASHBOARD
// =====================================================

import { create } from 'zustand';
import { supabase } from '../config/supabase';

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  inTransitOrders: number;
  deliveredOrders: number;
  totalUsers: number;
  totalRevenue: number;
  activeVehicles: number;
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalProductOrders: number;
  productRevenue: number;
}

interface AdminState {
  stats: AdminStats;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchStats: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const initialStats: AdminStats = {
  totalOrders: 0,
  pendingOrders: 0,
  inTransitOrders: 0,
  deliveredOrders: 0,
  totalUsers: 0,
  totalRevenue: 0,
  activeVehicles: 0,
  totalProducts: 0,
  activeProducts: 0,
  lowStockProducts: 0,
  totalProductOrders: 0,
  productRevenue: 0,
};

// Cache duration: 30 seconds
const CACHE_DURATION = 30 * 1000;

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: initialStats,
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchStats: async () => {
    const { lastFetched, isLoading } = get();
    const now = Date.now();

    // Return cached data if still valid and not currently loading
    if (lastFetched && now - lastFetched < CACHE_DURATION && !isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Fetch all data in parallel for better performance
      const [ordersResult, usersResult, vehiclesResult, productsResult, orderItemsResult] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('users').select('id'),
        supabase.from('vehicles').select('id').eq('is_active', true),
        supabase.from('products').select('*'),
        supabase.from('order_items').select('*'),
      ]);

      if (ordersResult.error) throw ordersResult.error;
      if (usersResult.error) throw usersResult.error;
      if (vehiclesResult.error) throw vehiclesResult.error;
      if (productsResult.error) throw productsResult.error;
      if (orderItemsResult.error) throw orderItemsResult.error;

      const ordersList = ordersResult.data || [];
      const usersList = usersResult.data || [];
      const vehiclesList = vehiclesResult.data || [];
      const productsList = productsResult.data || [];
      const orderItemsList = orderItemsResult.data || [];

      // Calculate revenue (shipping orders)
      const totalRevenue = ordersList.reduce((sum, order) => {
        return sum + (Number(order.final_cost) || Number(order.estimated_cost) || 0);
      }, 0);

      // Calculate product revenue (from order_items)
      const productRevenue = orderItemsList.reduce((sum, item) => {
        return sum + (Number(item.subtotal) || 0);
      }, 0);

      // Get orders that have order_items (ecommerce orders)
      const orderIdsWithItems = new Set(orderItemsList.map(item => item.order_id));
      const productOrders = ordersList.filter(order => orderIdsWithItems.has(order.id));

      // Calculate product statistics
      const activeProducts = productsList.filter(p => p.is_active).length;
      const lowStockProducts = productsList.filter(p => p.is_active && (p.stock_quantity || 0) < 10).length;

      // Calculate order statistics
      const stats: AdminStats = {
        totalOrders: ordersList.length,
        pendingOrders: ordersList.filter(o => 
          ['pending', 'quote_pending'].includes(o.status)
        ).length,
        inTransitOrders: ordersList.filter(o => 
          ['in_transit', 'picked_up'].includes(o.status)
        ).length,
        deliveredOrders: ordersList.filter(o => o.status === 'delivered').length,
        totalUsers: usersList.length,
        totalRevenue,
        activeVehicles: vehiclesList.length,
        totalProducts: productsList.length,
        activeProducts,
        lowStockProducts,
        totalProductOrders: productOrders.length,
        productRevenue,
      };

      set({
        stats,
        isLoading: false,
        error: null,
        lastFetched: now,
      });
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      set({
        isLoading: false,
        error: error.message || 'Error al cargar estadísticas',
        stats: initialStats,
      });
    }
  },

  refreshStats: async () => {
    // Force refresh by clearing cache
    set({ lastFetched: null });
    await get().fetchStats();
  },
}));

