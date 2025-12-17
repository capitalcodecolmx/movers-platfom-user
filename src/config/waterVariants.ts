export type WaterVariant = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  themeColor: string;
  sequencePath: string; // e.g., "/sequences/blanquita/" or "/dynamicvideo.webp"
  totalFrames: number; // 1 for single image, N for sequence
  darkMode?: boolean;
  logo?: string;
};

export const WATER_VARIANTS: WaterVariant[] = [
  {
    id: 'blanquita',
    name: 'BLANQUITA',
    subtitle: 'AGUA PURIFICADA',
    description: 'Pura, limpia y refrescante. Nuestra agua purificada premium pasa por procesos de filtración avanzados para garantizar la máxima pureza y sabor.',
    themeColor: '#06b6d4', // cyan-500
    sequencePath: '/herovideo.mp4',
    totalFrames: 1,
    darkMode: true,
    logo: '/LOGO AGUA NUEVO 2.webp'
  }
];

export const DEFAULT_VARIANT = WATER_VARIANTS[0];

