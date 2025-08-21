import { useState, useEffect, useCallback } from 'react';

interface ImageCache {
  [key: string]: {
    loaded: boolean;
    error: boolean;
  };
}

export const useImageCache = () => {
  const [cache, setCache] = useState<ImageCache>({});

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (cache[src]?.loaded) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        setCache(prev => ({
          ...prev,
          [src]: { loaded: true, error: false }
        }));
        resolve();
      };
      img.onerror = () => {
        setCache(prev => ({
          ...prev,
          [src]: { loaded: false, error: true }
        }));
        reject();
      };
      img.src = src;
    });
  }, [cache]);

  const preloadImages = useCallback(async (urls: string[]) => {
    const promises = urls.map(url => preloadImage(url).catch(() => {}));
    await Promise.allSettled(promises);
  }, [preloadImage]);

  const isImageLoaded = useCallback((src: string) => {
    return cache[src]?.loaded || false;
  }, [cache]);

  const hasImageError = useCallback((src: string) => {
    return cache[src]?.error || false;
  }, [cache]);

  return {
    preloadImage,
    preloadImages,
    isImageLoaded,
    hasImageError,
    cache
  };
};