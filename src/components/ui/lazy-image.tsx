import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  placeholderClassName?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  fallbackSrc = '/placeholder.svg',
  placeholderClassName
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  });

  useEffect(() => {
    if (isIntersecting && !imageSrc) {
      // Avoid loading base64 images that are too large
      if (src.startsWith('data:') && src.length > 100000) {
        setHasError(true);
        setImageSrc(fallbackSrc);
        return;
      }
      
      setImageSrc(src);
    }
  }, [isIntersecting, src, imageSrc, fallbackSrc]);

  // Reset states when src changes
  useEffect(() => {
    setImageSrc('');
    setImageLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <div ref={targetRef} className="relative w-full h-full overflow-hidden">
      {/* Placeholder/Loading state */}
      {!imageLoaded && !hasError && (
        <div className={cn(
          "absolute inset-0 bg-muted animate-pulse flex items-center justify-center",
          placeholderClassName
        )}>
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      
      {/* Actual image */}
      {imageSrc && !hasError && (
        <img
          src={imageSrc}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
      
      {/* Error fallback */}
      {hasError && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-muted to-muted/80 flex flex-col items-center justify-center text-muted-foreground",
          placeholderClassName
        )}>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xs font-medium">Image unavailable</span>
        </div>
      )}
    </div>
  );
}