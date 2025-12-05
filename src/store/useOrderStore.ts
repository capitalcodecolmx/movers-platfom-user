import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  presentacion?: string;
  tamaño?: string;
  quantity: number;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email?: string;
}

export type ServiceType = 'delivery' | 'pickup' | '';
export type PaymentMethod = 'cash' | 'online' | '';

export interface OrderState {
  serviceType: ServiceType;
  orderItems: OrderItem[];
  pickupLocation: any | null; // Agua Centro
  deliveryAddress: string;
  deliveryContact: ContactInfo;
  pickupContact: ContactInfo; // Only if needed (e.g. who picks up)
  pickupDate: string;
  pickupTime: string;
  paymentMethod: PaymentMethod;
  
  // Actions
  setServiceType: (type: ServiceType) => void;
  setOrderItems: (items: OrderItem[]) => void;
  addItem: (item: OrderItem) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  setPickupLocation: (location: any) => void;
  setDeliveryAddress: (address: string) => void;
  setContactInfo: (type: 'delivery' | 'pickup', info: ContactInfo) => void;
  setDateTime: (date: string, time: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  resetOrder: () => void;
  
  // Computed
  getTotalPrice: () => number;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      serviceType: '',
      orderItems: [],
      pickupLocation: null,
      deliveryAddress: '',
      deliveryContact: { name: '', phone: '', email: '' },
      pickupContact: { name: '', phone: '', email: '' },
      pickupDate: '',
      pickupTime: '',
      paymentMethod: '',

      setServiceType: (type) => set({ serviceType: type }),
      
      setOrderItems: (items) => set({ orderItems: items }),
      
      addItem: (item) => set((state) => {
        const existing = state.orderItems.find((i) => i.productId === item.productId);
        if (existing) {
          return {
            orderItems: state.orderItems.map((i) => 
              i.productId === item.productId 
                ? { ...i, quantity: i.quantity + item.quantity } 
                : i
            )
          };
        }
        return { orderItems: [...state.orderItems, item] };
      }),

      removeItem: (productId) => set((state) => ({
        orderItems: state.orderItems.filter((i) => i.productId !== productId)
      })),

      updateItemQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return { orderItems: state.orderItems.filter((i) => i.productId !== productId) };
        }
        return {
          orderItems: state.orderItems.map((i) => 
            i.productId === productId ? { ...i, quantity } : i
          )
        };
      }),

      setPickupLocation: (location) => set({ pickupLocation: location }),
      
      setDeliveryAddress: (address) => set({ deliveryAddress: address }),
      
      setContactInfo: (type, info) => set((state) => ({
        [type === 'delivery' ? 'deliveryContact' : 'pickupContact']: info
      })),
      
      setDateTime: (date, time) => set({ pickupDate: date, pickupTime: time }),
      
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      
      resetOrder: () => set({
        serviceType: '',
        orderItems: [],
        pickupLocation: null,
        deliveryAddress: '',
        deliveryContact: { name: '', phone: '', email: '' },
        pickupContact: { name: '', phone: '', email: '' },
        pickupDate: '',
        pickupTime: '',
        paymentMethod: '',
      }),

      getTotalPrice: () => {
        const { orderItems } = get();
        return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'order-storage', // name of the item in the storage (must be unique)
    }
  )
);
