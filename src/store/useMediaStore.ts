import { create } from 'zustand';

interface MediaState {
  cachedVideos: Record<string, string>;
  loading: Record<string, boolean>;
  getVideo: (url: string) => Promise<string>;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  cachedVideos: {},
  loading: {},
  getVideo: async (url: string) => {
    const { cachedVideos, loading } = get();
    
    // If already cached, return Blob URL
    if (cachedVideos[url]) {
      return cachedVideos[url];
    }

    // If already loading, wait (simple optimization, could be better with promises map, but keep simple)
    if (loading[url]) {
        // Just return original URL if loading to avoid blocking, or implement logic to wait.
        // For simplicity in this frequent-refresh scenario, we'll fetch.
        // Better: Wait for existing promise. adapting simple store for now.
    }

    set((state) => ({ loading: { ...state.loading, [url]: true } }));

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      set((state) => ({
        cachedVideos: { ...state.cachedVideos, [url]: objectUrl },
        loading: { ...state.loading, [url]: false }
      }));
      
      return objectUrl;
    } catch (error) {
      console.error("Failed to load video", error);
      set((state) => ({ loading: { ...state.loading, [url]: false } }));
      return url; // Fallback to original URL
    }
  }
}));
