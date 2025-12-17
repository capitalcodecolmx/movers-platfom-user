import { create } from 'zustand';

interface HeroVideoState {
  videoRef: HTMLVideoElement | null;
  isVideoLoaded: boolean;
  isVideoPlaying: boolean;
  setVideoRef: (ref: HTMLVideoElement | null) => void;
  setVideoLoaded: (loaded: boolean) => void;
  setVideoPlaying: (playing: boolean) => void;
}

export const useHeroVideoStore = create<HeroVideoState>((set) => ({
  videoRef: null,
  isVideoLoaded: false,
  isVideoPlaying: false,
  setVideoRef: (ref) => set({ videoRef: ref }),
  setVideoLoaded: (loaded) => set({ isVideoLoaded: loaded }),
  setVideoPlaying: (playing) => set({ isVideoPlaying: playing }),
}));
