import { useState, useEffect, useRef, useCallback } from 'react';
import type { WaterVariant } from '../../config/waterVariants';

interface UseWebPSequenceLoaderOptions {
  variant: WaterVariant;
  currentFrame: number;
  onLoadComplete?: () => void;
  onLoadProgress?: (progress: number) => void;
}

export const useWebPSequenceLoader = ({
  variant,
  currentFrame,
  onLoadComplete,
  onLoadProgress
}: UseWebPSequenceLoaderOptions) => {
  const [loadedFrames, setLoadedFrames] = useState<Map<number, HTMLImageElement>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const loadingFramesRef = useRef<Set<number>>(new Set());
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());

  // Load a single frame
  const loadFrame = useCallback((frameIndex: number): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (imagesRef.current.has(frameIndex)) {
        resolve(imagesRef.current.get(frameIndex)!);
        return;
      }

      if (loadingFramesRef.current.has(frameIndex)) {
        // Already loading, wait for it with timeout
        let checkCount = 0;
        const maxChecks = 200; // 10 seconds max (200 * 50ms)
        const checkInterval = setInterval(() => {
          checkCount++;
          
          // Check if frame loaded successfully
          if (imagesRef.current.has(frameIndex)) {
            clearInterval(checkInterval);
            resolve(imagesRef.current.get(frameIndex)!);
            return;
          }
          
          // Check if frame is no longer loading (failed or completed elsewhere)
          if (!loadingFramesRef.current.has(frameIndex)) {
            clearInterval(checkInterval);
            // If it's in imagesRef, it succeeded
            if (imagesRef.current.has(frameIndex)) {
              resolve(imagesRef.current.get(frameIndex)!);
            } else {
              // Frame failed to load
              reject(new Error(`Frame ${frameIndex} failed to load`));
            }
            return;
          }
          
          // Timeout after max checks
          if (checkCount >= maxChecks) {
            clearInterval(checkInterval);
            reject(new Error(`Timeout waiting for frame ${frameIndex} to load`));
          }
        }, 50);
        return;
      }

      loadingFramesRef.current.add(frameIndex);

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        imagesRef.current.set(frameIndex, img);
        loadingFramesRef.current.delete(frameIndex);
        setLoadedFrames(prev => new Map(prev).set(frameIndex, img));
        resolve(img);
      };

      img.onerror = () => {
        loadingFramesRef.current.delete(frameIndex);
        reject(new Error(`Failed to load frame ${frameIndex}`));
      };

      // Determine image path
      if (variant.totalFrames === 1) {
        // Single image
        img.src = variant.sequencePath;
      } else {
        // Numbered sequence: variant-1-frame-000.webp, variant-1-frame-001.webp, etc.
        const paddedIndex = frameIndex.toString().padStart(3, '0');
        img.src = `${variant.sequencePath}frame-${paddedIndex}.webp`;
      }
    });
  }, [variant]);

  // Preload frames with priority
  useEffect(() => {
    if (variant.totalFrames === 0) return;

    setIsLoading(true);
    setLoadProgress(0);

    const preloadFrames = async () => {
      const framesToLoad: number[] = [];
      
      if (variant.totalFrames === 1) {
        framesToLoad.push(0);
      } else {
        // Priority: current frame, then nearby frames, then rest
        const priorityFrames = new Set<number>();
        
        // Current frame and nearby
        for (let i = Math.max(0, currentFrame - 2); i <= Math.min(variant.totalFrames - 1, currentFrame + 2); i++) {
          priorityFrames.add(i);
        }
        
        // First 10 frames
        for (let i = 0; i < Math.min(10, variant.totalFrames); i++) {
          priorityFrames.add(i);
        }
        
        // Add rest
        for (let i = 0; i < variant.totalFrames; i++) {
          if (!priorityFrames.has(i)) {
            priorityFrames.add(i);
          }
        }
        
        framesToLoad.push(...Array.from(priorityFrames));
      }

      let loadedCount = 0;
      const totalFrames = framesToLoad.length;

      // Load frames in batches
      const batchSize = 5;
      for (let i = 0; i < framesToLoad.length; i += batchSize) {
        const batch = framesToLoad.slice(i, i + batchSize);
        await Promise.allSettled(
          batch.map(async (frameIndex) => {
            try {
              await loadFrame(frameIndex);
              loadedCount++;
              setLoadProgress((loadedCount / totalFrames) * 100);
            } catch (error) {
              console.warn(`Failed to load frame ${frameIndex}:`, error);
            }
          })
        );
      }

      setIsLoading(false);
      if (onLoadComplete) {
        onLoadComplete();
      }
    };

    preloadFrames();
  }, [variant.id, variant.totalFrames, variant.sequencePath, currentFrame, loadFrame, onLoadComplete]);

  // Get current frame image
  const currentImage = loadedFrames.get(currentFrame);

  // Update progress callback
  useEffect(() => {
    if (onLoadProgress) {
      onLoadProgress(loadProgress);
    }
  }, [loadProgress, onLoadProgress]);

  return {
    currentImage,
    isLoading,
    loadProgress,
    loadedFramesCount: loadedFrames.size,
    totalFrames: variant.totalFrames
  };
};

