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
      const [ordersResult, usersResult, vehiclesResult] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('users').select('id'),
        supabase.from('vehicles').select('id').eq('is_active', true),
      ]);

      if (ordersResult.error) throw ordersResult.error;
      if (usersResult.error) throw usersResult.error;
      if (vehiclesResult.error) throw vehiclesResult.error;

      const ordersList = ordersResult.data || [];
      const usersList = usersResult.data || [];
      const vehiclesList = vehiclesResult.data || [];

      // Calculate revenue
      const totalRevenue = ordersList.reduce((sum, order) => {
        return sum + (Number(order.final_cost) || Number(order.estimated_cost) || 0);
      }, 0);

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

