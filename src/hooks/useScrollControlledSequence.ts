import { useEffect, useRef, useState, useCallback } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface UseScrollControlledSequenceOptions {
  totalFrames: number;
  heroHeight: number;
  enabled?: boolean;
}

export const useScrollControlledSequence = ({
  totalFrames,
  heroHeight,
  enabled = true
}: UseScrollControlledSequenceOptions) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);

  const updateFrame = useCallback((progress: number) => {
    if (!enabled || totalFrames <= 1) {
      setCurrentFrame(0);
      setScrollProgress(0);
      return;
    }

    // Clamp progress between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, progress));
    setScrollProgress(clampedProgress);

    // Calculate frame index
    const frameIndex = Math.floor(clampedProgress * (totalFrames - 1));
    const newFrame = Math.max(0, Math.min(totalFrames - 1, frameIndex));

    if (newFrame !== lastFrameRef.current) {
      lastFrameRef.current = newFrame;
      setCurrentFrame(newFrame);
    }
  }, [enabled, totalFrames]);

  useEffect(() => {
    if (!enabled || totalFrames <= 1) {
      setCurrentFrame(0);
      return;
    }

    // Wait for DOM to be ready
    const heroElement = document.querySelector('.premium-hero-section');
    if (!heroElement) {
      // Retry after a short delay
      const timeout = setTimeout(() => {
        const retryElement = document.querySelector('.premium-hero-section');
        if (retryElement) {
          createScrollTrigger();
        }
      }, 100);
      return () => clearTimeout(timeout);
    }

    const createScrollTrigger = () => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: '.premium-hero-section',
        start: 'top top',
        end: () => `+=${heroHeight}`,
        scrub: 0.5, // Smooth scrubbing
        onUpdate: (self) => {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
          }
          rafRef.current = requestAnimationFrame(() => {
            updateFrame(self.progress);
          });
        }
      });
    };

    createScrollTrigger();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [enabled, totalFrames, heroHeight, updateFrame]);

  return {
    currentFrame,
    scrollProgress,
    totalFrames
  };
};

