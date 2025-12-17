import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { WATER_VARIANTS, DEFAULT_VARIANT } from '../../config/waterVariants';
import type { WaterVariant } from '../../config/waterVariants';
import { useScrollControlledSequence } from '../../hooks/useScrollControlledSequence';
import { useWebPSequenceLoader } from './WebPSequenceLoader';
import HeroTextOverlay from './HeroTextOverlay';
import VariantNavigator from './VariantNavigator';
import HeroSocialIcons from './HeroSocialIcons';
import LoadingOverlay from './LoadingOverlay';
import { useHeroVideoStore } from '../../store/useHeroVideoStore';

const PremiumHeroSection: React.FC = () => {
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [isChangingVariant, setIsChangingVariant] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [initialLoadProgress, setInitialLoadProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentVariant = WATER_VARIANTS[currentVariantIndex] || DEFAULT_VARIANT;
  
  // Zustand store for video state management (prevents re-renders)
  const { setVideoRef, isVideoLoaded, setVideoLoaded, setVideoPlaying } = useHeroVideoStore();

  // Scroll-controlled sequence
  const { currentFrame } = useScrollControlledSequence({
    totalFrames: currentVariant.totalFrames,
    heroHeight: typeof window !== 'undefined' ? window.innerHeight : 1000,
    enabled: !isInitialLoading && currentVariant.totalFrames > 1
  });

  // WebP sequence loader
  const { currentImage, isLoading: isSequenceLoading, loadProgress } = useWebPSequenceLoader({
    variant: currentVariant,
    currentFrame,
    onLoadComplete: () => {
      if (isInitialLoading) {
        setIsInitialLoading(false);
      }
    },
    onLoadProgress: (progress) => {
      if (isInitialLoading) {
        setInitialLoadProgress(progress);
      }
    }
  });

  // Initialize video reference in Zustand store (only once)
  useEffect(() => {
    if (videoRef.current) {
      setVideoRef(videoRef.current);
    }
    return () => {
      setVideoRef(null);
    };
  }, [setVideoRef]);

  // Handle variant change
  const handleVariantChange = (direction: 'next' | 'prev') => {
    if (isChangingVariant || isSequenceLoading) return;

    setIsChangingVariant(true);

    const newIndex = direction === 'next'
      ? Math.min(currentVariantIndex + 1, WATER_VARIANTS.length - 1)
      : Math.max(currentVariantIndex - 1, 0);

    if (newIndex !== currentVariantIndex) {
      setCurrentVariantIndex(newIndex);
      
      // Reset scroll position for new variant
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Wait for new variant to load
      setTimeout(() => {
        setIsChangingVariant(false);
      }, 500);
    } else {
      setIsChangingVariant(false);
    }
  };

  // Apply theme color
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--theme-color', currentVariant.themeColor);
    }
  }, [currentVariant.themeColor]);

  // Video loading handlers (optimized to prevent re-renders)
  const handleVideoLoadedMetadata = useCallback(() => {
    setVideoLoaded(true);
    setInitialLoadProgress(50);
  }, [setVideoLoaded]);

  const handleVideoCanPlay = useCallback(() => {
    setVideoLoaded(true);
    setInitialLoadProgress(100);
    setIsInitialLoading(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked, but video is ready
        setIsInitialLoading(false);
      });
    }
  }, [setVideoLoaded]);

  const handleVideoPlaying = useCallback(() => {
    setVideoPlaying(true);
  }, [setVideoPlaying]);

  const handleVideoError = useCallback(() => {
    setIsInitialLoading(false);
    setVideoLoaded(false);
  }, []);

  // Update video source when variant changes (only if needed, prevents unnecessary reloads)
  useEffect(() => {
    if (videoRef.current && currentVariant.sequencePath.endsWith('.mp4')) {
      const currentSrc = videoRef.current.getAttribute('src');
      const newSrc = currentVariant.sequencePath;
      // Only update if source actually changed
      if (currentSrc !== newSrc) {
        videoRef.current.src = newSrc;
        videoRef.current.load();
        setVideoLoaded(false);
        setIsInitialLoading(true);
      }
    }
  }, [currentVariant.sequencePath, setVideoLoaded]);

  // GSAP animations
  useGSAP(() => {
    if (!heroRef.current || isInitialLoading) return;

    const tl = gsap.timeline();
    
    // Fade in hero
    tl.fromTo(
      heroRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' }
    );
  }, { scope: heroRef, dependencies: [isInitialLoading] });

  return (
    <>
      <LoadingOverlay progress={initialLoadProgress} isVisible={isInitialLoading} />
      
      <section
        ref={heroRef}
        className="premium-hero-section relative w-full h-screen min-h-[600px] overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
        style={{ opacity: isInitialLoading ? 0 : 1 }}
      >
        {/* Background Video */}
        {currentVariant.sequencePath.endsWith('.mp4') ? (
          <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full overflow-hidden">
            <video
              ref={videoRef}
              className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
              src={currentVariant.sequencePath}
              preload="metadata"
              muted
              loop
              playsInline
              autoPlay
              onLoadedMetadata={handleVideoLoadedMetadata}
              onCanPlay={handleVideoCanPlay}
              onPlaying={handleVideoPlaying}
              onError={handleVideoError}
              style={{
                opacity: isVideoLoaded ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
            />
            {/* Modern Gradient Overlay - Minimal for video visibility */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-black/10 via-transparent to-black/15"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-black/8 via-transparent to-transparent"></div>
          </div>
        ) : (
          <div
            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500 brightness-100"
            style={{
              backgroundImage: `url(${currentVariant.sequencePath})`,
              opacity: currentImage ? 1 : 0,
              willChange: 'opacity'
            }}
          >
            {/* Modern Gradient Overlay - Minimal for video visibility */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-black/10 via-transparent to-black/15"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-black/8 via-transparent to-transparent"></div>
          </div>
        )}

        {/* Text Overlay - Left Side */}
        <HeroTextOverlay variant={currentVariant} isChanging={isChangingVariant} />

        {/* Variant Navigator - Right Side */}
        {WATER_VARIANTS.length > 1 && (
          <VariantNavigator
            currentVariantIndex={currentVariantIndex}
            totalVariants={WATER_VARIANTS.length}
            onPrevious={() => handleVariantChange('prev')}
            onNext={() => handleVariantChange('next')}
            isLoading={isChangingVariant || isSequenceLoading}
          />
        )}

        {/* Social Icons - Bottom Center */}
        <HeroSocialIcons />

        {/* Scroll Indicator - Only show if multiple frames */}
        {currentVariant.totalFrames > 1 && (
          <div className="absolute bottom-24 sm:bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-white/40">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest">Desliza</span>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default PremiumHeroSection;

