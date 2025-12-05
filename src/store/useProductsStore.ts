import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../data/mockData';
import { supabase } from '../config/supabase';

export type SortField = 'price' | 'name';
export type SortDirection = 'asc' | 'desc';

export interface ProductFilters {
  marca: string[];
  submarca: string[];
  sabor: string[];
  presentacion: string[];
  tamaño: string[];
  tipoAgua: string[];
  tipoProducto: string[];
  priceRange: [number, number];
}

interface ImageCache {
  [key: string]: string; // productId -> base64 or blob URL
}

interface ProductsState {
  products: Product[];
  filters: ProductFilters;
  sortField: SortField;
  sortDirection: SortDirection;
  imageCache: ImageCache;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  setSort: (field: SortField, direction: SortDirection) => void;
  cacheImage: (productId: string, imageData: string) => void;
  getCachedImage: (productId: string) => string | null;
  getFilteredAndSortedProducts: () => Product[];
  
  // Realtime
  subscription: any | null;
  subscribeToProducts: () => void;
  unsubscribeFromProducts: () => void;
}

const defaultFilters: ProductFilters = {
  marca: [],
  submarca: [],
  sabor: [],
  presentacion: [],
  tamaño: [],
  tipoAgua: [],
  tipoProducto: [],
  priceRange: [0, 1000]
};

// Helper function to convert image to base64
const imageToBase64 = (imagePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        try {
          const base64 = canvas.toDataURL('image/png');
          resolve(base64);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    img.onerror = reject;
    img.src = imagePath;
  });
};

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      filters: defaultFilters,
      sortField: 'name',
      sortDirection: 'asc',
      imageCache: {},
      subscription: null,
      isLoading: false,
      error: null,

      fetchProducts: async () => {
        console.log('fetchProducts: Starting...');
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: true });

          console.log('fetchProducts: Data received:', data);
          console.log('fetchProducts: Error:', error);

          if (error) throw error;

          // Transform database products to match Product interface
          const transformedProducts: Product[] = (data || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            image: p.image || '',
            category: p.category as 'garrafon' | 'botella' | 'hielo',
            description: p.description || '',
            marca: p.marca || '',
            submarca: p.submarca || undefined,
            sabor: p.sabor || undefined,
            presentacion: p.presentacion || '',
            tamaño: p.tamaño || '',
            tipoAgua: p.tipoagua || '', // Fixed: tipoagua not tipoAgua
            tipoProducto: p.tipoproducto || '', // Fixed: tipoproducto not tipoProducto
          }));

          console.log('fetchProducts: Transformed products:', transformedProducts);
          set({ products: transformedProducts, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching products:', error);
          set({ error: error.message || 'Error al cargar productos', isLoading: false });
        }
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }));
      },

      clearFilters: () => {
        set({ filters: defaultFilters });
      },

      setSort: (field, direction) => {
        set({ sortField: field, sortDirection: direction });
      },

      cacheImage: (productId, imageData) => {
        set((state) => ({
          imageCache: { ...state.imageCache, [productId]: imageData }
        }));
      },

      getCachedImage: (productId) => {
        return get().imageCache[productId] || null;
      },

      getFilteredAndSortedProducts: () => {
        const state = get();
        let filtered = [...state.products];
        console.log('DEBUG: Starting filter. Initial count:', filtered.length);

        // Apply filters
        const { filters } = state;
        
        if (filters.marca.length > 0) {
          filtered = filtered.filter(p => filters.marca.includes(p.marca));
          console.log('DEBUG: After marca filter:', filtered.length);
        }
        
        if (filters.submarca.length > 0) {
          filtered = filtered.filter(p => p.submarca && filters.submarca.includes(p.submarca));
          console.log('DEBUG: After submarca filter:', filtered.length);
        }
        
        if (filters.sabor.length > 0) {
          filtered = filtered.filter(p => p.sabor && filters.sabor.includes(p.sabor));
          console.log('DEBUG: After sabor filter:', filtered.length);
        }
        
        if (filters.presentacion.length > 0) {
          filtered = filtered.filter(p => filters.presentacion.includes(p.presentacion));
        }
        
        if (filters.tamaño.length > 0) {
          filtered = filtered.filter(p => filters.tamaño.includes(p.tamaño));
        }
        
        if (filters.tipoAgua.length > 0) {
          filtered = filtered.filter(p => filters.tipoAgua.includes(p.tipoAgua));
        }
        
        if (filters.tipoProducto.length > 0) {
          filtered = filtered.filter(p => filters.tipoProducto.includes(p.tipoProducto));
        }
        
        // Price range filter
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
          filtered = filtered.filter(p => 
            p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
          );
        }

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
          let comparison = 0;
          
          if (state.sortField === 'price') {
            comparison = a.price - b.price;
          } else if (state.sortField === 'name') {
            comparison = a.name.localeCompare(b.name);
          }
          
          return state.sortDirection === 'asc' ? comparison : -comparison;
        });

        return sorted;
      },
      subscribeToProducts: () => {
        const state = get();
        // If already subscribed, don't subscribe again
        if (state.subscription) return;

        const subscription = supabase
          .channel('public:products')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'products' },
            async (payload) => {
              console.log('Realtime product update:', payload);
              // Fetch fresh data on any change and re-verify image cache
              await get().fetchProducts();
              await initializeImageCache();
            }
          )
          .subscribe();

        set({ subscription });
      },

      unsubscribeFromProducts: () => {
        const { subscription } = get();
        if (subscription) {
          subscription.unsubscribe();
          set({ subscription: null });
        }
      }
    }),
    {
      name: 'products-storage',
      partialize: (state) => ({
        filters: state.filters,
        sortField: state.sortField,
        sortDirection: state.sortDirection,
        imageCache: state.imageCache
      })
    }
  )
);

// Initialize image cache for all products
export const initializeImageCache = async () => {
  const store = useProductsStore.getState();
  
  // Fetch products first if not loaded
  if (store.products.length === 0) {
    await store.fetchProducts();
  }
  
  for (const product of store.products) {
    const cached = store.getCachedImage(product.id);
    if (!cached && product.image) {
      try {
        const base64 = await imageToBase64(product.image);
        store.cacheImage(product.id, base64);
      } catch (error) {
        console.warn(`Failed to cache image for product ${product.id}:`, error);
      }
    }
  }
};

