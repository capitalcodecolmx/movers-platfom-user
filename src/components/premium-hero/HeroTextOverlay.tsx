import React, { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { WaterVariant } from '../../config/waterVariants';
import { COMPANY_INFO } from '../../data/mockData';
import HeroCTAs from './HeroCTAs';

interface HeroTextOverlayProps {
  variant: WaterVariant;
  isChanging: boolean;
}

const HeroTextOverlay: React.FC<HeroTextOverlayProps> = ({ variant, isChanging }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!textRef.current || isChanging) return;

    const tl = gsap.timeline();
    const elements = textRef.current.children;

    tl.fromTo(
      elements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      }
    );
  }, { scope: containerRef, dependencies: [variant.id, isChanging] });

  // Fade out/in on variant change
  useEffect(() => {
    if (!textRef.current) return;

    if (isChanging) {
      gsap.to(textRef.current.children, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
    } else {
      gsap.to(textRef.current.children, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out'
      });
    }
  }, [isChanging]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center z-20 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        <div
          ref={textRef}
          className="max-w-2xl space-y-4 sm:space-y-5 md:space-y-6 pointer-events-auto"
        >
          {/* Logo */}
          {variant.logo && (
            <div className="opacity-0 mb-4 sm:mb-6">
              <img
                src={variant.logo}
                alt={COMPANY_INFO.name}
                className="h-10 sm:h-12 md:h-14 w-auto object-contain filter brightness-0 invert"
              />
            </div>
          )}

          {/* Description */}
          <p className="opacity-0 text-xs sm:text-sm md:text-base lg:text-lg text-white/95 leading-relaxed max-w-xl font-light drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
            {variant.description}
          </p>

          {/* CTAs */}
          <div className="opacity-0">
            <HeroCTAs themeColor={variant.themeColor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroTextOverlay;

