import { create } from 'zustand';
import { Product, PRODUCTS } from '../data/mockData';
import { searchProducts } from '../utils/searchUtils';

interface SearchState {
  query: string;
  results: Product[];
  isOpen: boolean;
  isLoading: boolean;
  recentSearches: string[];
  
  // Actions
  setQuery: (query: string) => void;
  performSearch: (query: string) => void;
  clearSearch: () => void;
  setIsOpen: (isOpen: boolean) => void;
  addToRecentSearches: (query: string) => void;
  clearRecentSearches: () => void;
}

const MAX_RECENT_SEARCHES = 5;
const MAX_RESULTS = 8;

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  isOpen: false,
  isLoading: false,
  recentSearches: [],

  setQuery: (query: string) => {
    set({ query });
  },

  performSearch: (query: string) => {
    set({ isLoading: true });
    
    // Simulate async search (in case you want to add API calls later)
    setTimeout(() => {
      const results = searchProducts(PRODUCTS, query).slice(0, MAX_RESULTS);
      set({ 
        results, 
        isLoading: false,
        isOpen: query.trim().length > 0
      });
    }, 100);
  },

  clearSearch: () => {
    set({ 
      query: '', 
      results: [], 
      isOpen: false,
      isLoading: false 
    });
  },

  setIsOpen: (isOpen: boolean) => {
    set({ isOpen });
  },

  addToRecentSearches: (query: string) => {
    if (!query.trim()) return;
    
    const { recentSearches } = get();
    const filtered = recentSearches.filter(s => s !== query);
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    
    set({ recentSearches: updated });
    
    // Persist to localStorage
    try {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  },

  clearRecentSearches: () => {
    set({ recentSearches: [] });
    try {
      localStorage.removeItem('recentSearches');
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  },
}));

// Load recent searches from localStorage on initialization
try {
  const stored = localStorage.getItem('recentSearches');
  if (stored) {
    const recentSearches = JSON.parse(stored);
    useSearchStore.setState({ recentSearches });
  }
} catch (error) {
  console.error('Failed to load recent searches:', error);
}
