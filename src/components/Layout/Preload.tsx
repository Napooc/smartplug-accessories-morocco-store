
import { useEffect } from 'react';

// This component preloads critical resources during initial load for faster rendering
const Preload: React.FC = () => {
  useEffect(() => {
    // Preload critical images with priority
    const preloadImages = [
      '/lovable-uploads/eadfa6b1-267d-4782-914f-c0c339dba27d.png', // Logo
      '/lovable-uploads/02a6d3b3-6ce9-44fe-8bd5-b6587c390932.png', // Favicon
    ];
    
    // Use Priority loading for critical images
    preloadImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default Preload;
