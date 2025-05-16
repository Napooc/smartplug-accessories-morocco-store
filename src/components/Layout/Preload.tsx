
import { useEffect } from 'react';

// This component preloads critical resources on initial load
const Preload: React.FC = () => {
  useEffect(() => {
    // Preload critical images
    const preloadImages = [
      '/lovable-uploads/eadfa6b1-267d-4782-914f-c0c339dba27d.png', // Logo
      '/lovable-uploads/02a6d3b3-6ce9-44fe-8bd5-b6587c390932.png', // Favicon
    ];
    
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default Preload;
