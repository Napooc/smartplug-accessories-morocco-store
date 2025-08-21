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
    <div ref={targetRef} className={cn("relative w-full h-full", className)}>
      {/* Placeholder/Loading state */}
      {!imageLoaded && (
        <div className={cn(
          "absolute inset-0 bg-muted animate-pulse flex items-center justify-center",
          placeholderClassName
        )}>
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      
      {/* Actual image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
      
      {/* Error fallback */}
      {hasError && imageSrc === fallbackSrc && (
        <div className={cn(
          "absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground text-sm",
          placeholderClassName
        )}>
          Image unavailable
        </div>
      )}
    </div>
  );
}