// =====================================================
// TIPOS DE BASE DE DATOS PARA MUVERS PLATFORM
// =====================================================

// =====================================================
// TIPOS BÁSICOS
// =====================================================

export type UserRole = 'user' | 'admin' | 'repartidor';
export type OrderStatus = 'pending' | 'processing' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled' | 'failed';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type VehicleType = 'moto' | 'auto' | 'van' | 'camion' | 'bicicleta';
export type NotificationType = 'order_created' | 'order_processed' | 'order_assigned' | 'order_picked_up' | 'order_in_transit' | 'order_delivered' | 'order_cancelled' | 'payment_confirmed' | 'payment_failed' | 'quote_ready' | 'admin_message';
export type MessageType = 'text' | 'image' | 'file' | 'system';

// =====================================================
// INTERFACES DE DATOS JSONB
// =====================================================

export interface PackageData {
  weight: number; // en kg
  dimensions: {
    length: number; // en cm
    width: number;  // en cm
    height: number; // en cm
  };
  description: string;
  declaredValue: number; // valor declarado del paquete
  category?: string; // frágil, electrónicos, documentos, etc.
  photos?: string[]; // URLs de fotos del paquete
}

export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  reference?: string; // referencias adicionales
  instructions?: string; // instrucciones especiales
}

export interface ContactInfo {
  name: string;
  phone: string;
  email?: string;
  preferredHours?: {
    start: string; // formato HH:MM
    end: string;   // formato HH:MM
  };
  alternativePhone?: string;
}

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  clabe?: string;
  accountHolderName: string;
  accountType?: 'checking' | 'savings';
}

export interface Attachment {
  url: string;
  filename: string;
  type: 'image' | 'document' | 'other';
  uploadedAt: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  timestamp?: string;
}

export interface AdditionalFees {
  insurance?: number;
  fuel?: number;
  tolls?: number;
  specialHandling?: number;
  weekendFee?: number;
  nightFee?: number;
  [key: string]: number | undefined;
}

// =====================================================
// INTERFACES PRINCIPALES DE BASE DE DATOS
// =====================================================

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
  company_name?: string;
  tax_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  tracking_code: string;
  user_id: string;
  status: OrderStatus;
  
  // Información del paquete
  package_data: PackageData;
  
  // Direcciones
  pickup_address: Address;
  delivery_address: Address;
  
  // Información de contacto
  pickup_contact: ContactInfo;
  delivery_contact: ContactInfo;
  
  // Fechas y horarios
  pickup_date?: string;
  pickup_time?: string;
  delivery_date?: string;
  delivery_time?: string;
  
  // Costos y pagos
  estimated_cost?: number;
  final_cost?: number;
  payment_status: PaymentStatus;
  payment_method?: string;
  payment_reference?: string;
  
  // Información bancaria
  bank_info?: BankInfo;
  
  // Asignación
  assigned_repartidor_id?: string;
  assigned_vehicle_id?: string;
  
  // Fechas de seguimiento
  created_at: string;
  updated_at: string;
  processed_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  
  // Notas y comentarios
  admin_notes?: string;
  customer_notes?: string;
  
  // Archivos adjuntos
  attachments?: Attachment[];
}

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  license_plate?: string;
  capacity_kg?: number;
  capacity_volume?: number; // en metros cúbicos
  is_active: boolean;
  current_location?: Location;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  order_id?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  order_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  message_type: MessageType;
  attachments?: Attachment[];
  is_read: boolean;
  created_at: string;
}

export interface OrderTracking {
  id: string;
  order_id: string;
  status: OrderStatus;
  location?: Location;
  notes?: string;
  updated_by?: string;
  created_at: string;
}

export interface Quote {
  id: string;
  order_id: string;
  distance_km?: number;
  weight_kg?: number;
  volume_m3?: number;
  base_cost?: number;
  additional_fees?: AdditionalFees;
  total_cost?: number;
  valid_until?: string;
  created_at: string;
}

export interface PricingConfig {
  id: string;
  vehicle_type: VehicleType;
  base_price_per_km: number;
  price_per_kg: number;
  price_per_m3: number;
  minimum_cost: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// TIPOS PARA FORMULARIOS Y API
// =====================================================

export interface CreateOrderRequest {
  package_data: PackageData;
  pickup_address: Address;
  delivery_address: Address;
  pickup_contact: ContactInfo;
  delivery_contact: ContactInfo;
  pickup_date?: string;
  pickup_time?: string;
  delivery_date?: string;
  delivery_time?: string;
  customer_notes?: string;
  bank_info?: BankInfo;
  attachments?: Attachment[];
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  assigned_repartidor_id?: string;
  assigned_vehicle_id?: string;
  final_cost?: number;
  payment_status?: PaymentStatus;
  payment_method?: string;
  payment_reference?: string;
  admin_notes?: string;
  customer_notes?: string;
}

export interface CreateMessageRequest {
  order_id: string;
  recipient_id: string;
  message: string;
  message_type?: MessageType;
  attachments?: Attachment[];
}

export interface CreateNotificationRequest {
  user_id: string;
  order_id?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

// =====================================================
// TIPOS PARA RESPUESTAS DE API
// =====================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface OrderWithDetails extends Order {
  user: User;
  assigned_repartidor?: User;
  vehicle?: Vehicle;
  tracking_history: OrderTracking[];
  messages: Message[];
  quotes: Quote[];
}

export interface UserWithProfile extends User {
  profile?: UserProfile;
}

// =====================================================
// TIPOS PARA ESTADOS DE LA APLICACIÓN
// =====================================================

export interface AppState {
  user: UserWithProfile | null;
  orders: Order[];
  notifications: Notification[];
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
}

export interface OrderFilters {
  status?: OrderStatus[];
  dateFrom?: string;
  dateTo?: string;
  assigned_repartidor_id?: string;
  search?: string;
}

export interface NotificationFilters {
  is_read?: boolean;
  type?: NotificationType[];
  dateFrom?: string;
  dateTo?: string;
}

// =====================================================
// TIPOS PARA CÁLCULOS Y COTIZACIONES
// =====================================================

export interface DistanceCalculation {
  distance_km: number;
  duration_minutes: number;
  route: {
    lat: number;
    lng: number;
  }[];
}

export interface CostCalculation {
  base_cost: number;
  additional_fees: AdditionalFees;
  total_cost: number;
  breakdown: {
    distance_cost: number;
    weight_cost: number;
    volume_cost: number;
    fees: AdditionalFees;
  };
}

export interface QuoteRequest {
  pickup_address: Address;
  delivery_address: Address;
  package_data: PackageData;
  vehicle_type?: VehicleType;
  pickup_date?: string;
  delivery_date?: string;
}

export interface QuoteResponse {
  quote: Quote;
  distance: DistanceCalculation;
  cost: CostCalculation;
  estimated_delivery_time: string;
  available_vehicles: Vehicle[];
}



