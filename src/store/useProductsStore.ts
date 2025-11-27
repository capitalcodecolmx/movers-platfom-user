import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../data/mockData';
import { PRODUCTS } from '../data/mockData';

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
  
  // Actions
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  setSort: (field: SortField, direction: SortDirection) => void;
  cacheImage: (productId: string, imageData: string) => void;
  getCachedImage: (productId: string) => string | null;
  getFilteredAndSortedProducts: () => Product[];
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
      products: PRODUCTS,
      filters: defaultFilters,
      sortField: 'name',
      sortDirection: 'asc',
      imageCache: {},

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

        // Apply filters
        const { filters } = state;
        
        if (filters.marca.length > 0) {
          filtered = filtered.filter(p => filters.marca.includes(p.marca));
        }
        
        if (filters.submarca.length > 0) {
          filtered = filtered.filter(p => p.submarca && filters.submarca.includes(p.submarca));
        }
        
        if (filters.sabor.length > 0) {
          filtered = filtered.filter(p => p.sabor && filters.sabor.includes(p.sabor));
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
  
  for (const product of PRODUCTS) {
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

