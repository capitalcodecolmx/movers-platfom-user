import React from 'react';
import { Icon } from '@iconify/react';
import type { WaterVariant } from '../../config/waterVariants';

interface VariantNavigatorProps {
  currentVariantIndex: number;
  totalVariants: number;
  onPrevious: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

const VariantNavigator: React.FC<VariantNavigatorProps> = ({
  currentVariantIndex,
  totalVariants,
  onPrevious,
  onNext,
  isLoading = false
}) => {
  const currentIndex = currentVariantIndex + 1;
  const paddedIndex = currentIndex.toString().padStart(2, '0');

  return (
    <div className="hidden sm:flex absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-4 sm:gap-5 md:gap-6">
      {/* Index Number */}
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white/20 select-none">
        {paddedIndex}
      </div>

      {/* Navigation Strip */}
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        {/* PREV Button */}
        <button
          onClick={onPrevious}
          disabled={isLoading || currentVariantIndex === 0}
          className="group flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Variante anterior"
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold">ANT</span>
          <Icon
            icon="mdi:chevron-up"
            className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-1 transition-transform"
          />
        </button>

        {/* Divider */}
        <div className="w-px h-8 sm:h-10 md:h-12 bg-white/20"></div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute">
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        {/* NEXT Button */}
        <button
          onClick={onNext}
          disabled={isLoading || currentVariantIndex === totalVariants - 1}
          className="group flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Siguiente variante"
        >
          <Icon
            icon="mdi:chevron-down"
            className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-y-1 transition-transform"
          />
          <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold">SIG</span>
        </button>
      </div>
    </div>
  );
};

export default VariantNavigator;

