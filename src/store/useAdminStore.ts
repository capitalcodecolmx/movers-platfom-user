import { create } from 'zustand';
import { supabase } from '../config/supabase';
import type { OrderWithDetails, OrderStatus } from '../types/database';

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
  orders: OrderWithDetails[];
  currentOrder: OrderWithDetails | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchStats: () => Promise<void>;
  refreshStats: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  assignOrder: (orderId: string, driverId: string, vehicleId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
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
  orders: [],
  currentOrder: null,
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

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      // Use explicit table references with foreign key names
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:users!orders_user_id_fkey (
            id,
            full_name,
            email,
            phone
          ),
          assigned_repartidor:users!orders_assigned_repartidor_id_fkey (
            id,
            full_name,
            email,
            phone
          ),
          vehicle:vehicles!orders_assigned_vehicle_id_fkey (
            id,
            name,
            type,
            license_plate
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched orders:', data?.length || 0);
      set({ orders: data as OrderWithDetails[], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:users!orders_user_id_fkey (
            id,
            full_name,
            email,
            phone
          ),
          assigned_repartidor:users!orders_assigned_repartidor_id_fkey (
            id,
            full_name,
            email,
            phone
          ),
          vehicle:vehicles!orders_assigned_vehicle_id_fkey (
            id,
            name,
            type,
            license_plate
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      set({ currentOrder: data as OrderWithDetails, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching order:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  assignOrder: async (orderId: string, repartidorId: string, vehicleId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          assigned_repartidor_id: repartidorId,
          assigned_vehicle_id: vehicleId,
          status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      const { orders } = get();
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, assigned_repartidor_id: repartidorId, assigned_vehicle_id: vehicleId, status: 'assigned' as OrderStatus } 
          : order
      );
      
      set({ orders: updatedOrders, isLoading: false });
      
      // Refresh stats to reflect status change
      get().refreshStats();
    } catch (error: any) {
      console.error('Error assigning order:', error);
      set({ isLoading: false, error: error.message || 'Error al asignar orden' });
      throw error;
    }
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      const { orders } = get();
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status } 
          : order
      );
      
      set({ orders: updatedOrders, isLoading: false });
      
      // Refresh stats
      get().refreshStats();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      set({ isLoading: false, error: error.message || 'Error al actualizar estado' });
      throw error;
    }
  }
}));

