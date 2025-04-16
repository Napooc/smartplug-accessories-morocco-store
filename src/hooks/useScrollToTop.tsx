
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A custom hook that scrolls the window to the top when the route changes
 * Modified to handle possible security errors in iframe environments
 */
export function useScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    try {
      // Use scrollTo with options, but wrapped in try/catch
      const scrollOptions = {
        top: 0,
        behavior: 'smooth' as ScrollBehavior
      };
      
      // First try the Element.scrollTo method on documentElement
      if (document.documentElement.scrollTo) {
        document.documentElement.scrollTo(scrollOptions);
      } 
      // Then try the window.scrollTo
      else if (window.scrollTo) {
        window.scrollTo(scrollOptions);
      }
      // Finally fallback to setting scrollTop directly
      else {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0; // For Safari
      }
    } catch (error) {
      console.error("Error scrolling to top:", error);
      // Fallback for browsers that don't support smooth scrolling or have security restrictions
      try {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0; // For Safari
      } catch (innerError) {
        console.error("Fallback scroll also failed:", innerError);
      }
    }
  }, [pathname]);
}
