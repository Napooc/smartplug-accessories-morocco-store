
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A custom hook that scrolls the window to the top when the route changes
 */
export function useScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      console.error("Error scrolling to top:", error);
      // Fallback for browsers that don't support smooth scrolling
      try {
        window.scrollTo(0, 0);
      } catch (innerError) {
        console.error("Fallback scroll also failed:", innerError);
      }
    }
  }, [pathname]);
}
