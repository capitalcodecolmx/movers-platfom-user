// =====================================================
// CONFIGURACIÓN DE SUPABASE PARA MUVERS PLATFORM
// =====================================================

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// =====================================================
// CONFIGURACIÓN DE REALTIME
// =====================================================

// Canales de Realtime para notificaciones
export const REALTIME_CHANNELS = {
  NOTIFICATIONS: 'notifications',
  MESSAGES: 'messages',
  ORDER_UPDATES: 'order_updates',
  TRACKING_UPDATES: 'tracking_updates'
} as const;

// =====================================================
// FUNCIONES DE UTILIDAD PARA REALTIME
// =====================================================

export class RealtimeService {
  private channels: Map<string, any> = new Map();

  // Suscribirse a notificaciones de un usuario
  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    const channelName = `${REALTIME_CHANNELS.NOTIFICATIONS}:${userId}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Suscribirse a mensajes de un pedido
  subscribeToOrderMessages(orderId: string, callback: (payload: any) => void) {
    const channelName = `${REALTIME_CHANNELS.MESSAGES}:${orderId}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `order_id=eq.${orderId}`
        },
        callback
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Suscribirse a actualizaciones de pedidos
  subscribeToOrderUpdates(orderId: string, callback: (payload: any) => void) {
    const channelName = `${REALTIME_CHANNELS.ORDER_UPDATES}:${orderId}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        callback
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Suscribirse a actualizaciones de seguimiento
  subscribeToTrackingUpdates(orderId: string, callback: (payload: any) => void) {
    const channelName = `${REALTIME_CHANNELS.TRACKING_UPDATES}:${orderId}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_tracking',
          filter: `order_id=eq.${orderId}`
        },
        callback
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Desuscribirse de un canal
  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  // Desuscribirse de todos los canales
  unsubscribeAll() {
    this.channels.forEach((channel, channelName) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}

// Instancia global del servicio de Realtime
export const realtimeService = new RealtimeService();

// =====================================================
// CONFIGURACIÓN DE ALMACENAMIENTO
// =====================================================

export const STORAGE_BUCKETS = {
  PACKAGE_PHOTOS: 'package-photos',
  DOCUMENTS: 'documents',
  AVATARS: 'avatars',
  ATTACHMENTS: 'attachments'
} as const;

// =====================================================
// FUNCIONES DE UTILIDAD PARA ALMACENAMIENTO
// =====================================================

export class StorageService {
  // Subir foto de paquete
  async uploadPackagePhoto(file: File, orderId: string): Promise<string> {
    const fileName = `${orderId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.PACKAGE_PHOTOS)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.PACKAGE_PHOTOS)
      .getPublicUrl(fileName);

    return publicUrl;
  }

  // Subir documento
  async uploadDocument(file: File, orderId: string): Promise<string> {
    const fileName = `${orderId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.DOCUMENTS)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.DOCUMENTS)
      .getPublicUrl(fileName);

    return publicUrl;
  }

  // Subir avatar
  async uploadAvatar(file: File, userId: string): Promise<string> {
    const fileName = `${userId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.AVATARS)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.AVATARS)
      .getPublicUrl(fileName);

    return publicUrl;
  }

  // Eliminar archivo
  async deleteFile(bucket: string, fileName: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
  }
}

// Instancia global del servicio de almacenamiento
export const storageService = new StorageService();

// =====================================================
// CONFIGURACIÓN DE AUTENTICACIÓN
// =====================================================

export class AuthService {
  // Iniciar sesión
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  // Registrarse
  async signUp(email: string, password: string, userData: {
    full_name: string;
    phone?: string;
    role?: string;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    if (error) throw error;
    return data;
  }

  // Cerrar sesión
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Obtener usuario actual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Obtener sesión actual
  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  // Escuchar cambios de autenticación
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

// Instancia global del servicio de autenticación
export const authService = new AuthService();



