
import React, { useEffect } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { updatePageLinks } from '@/lib/languageUtils';

/**
 * This component automatically adds language parameters to all links on the page.
 * It should be used in the Layout component to ensure all links have the language parameter.
 * Modified to use a safer approach for iframe environments.
 */
export const LanguageLinkInjector: React.FC = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Function to safely update links
    const safeUpdateLinks = () => {
      try {
        updatePageLinks(language);
      } catch (error) {
        console.error("Error updating links:", error);
      }
    };
    
    // Update links when language changes
    safeUpdateLinks();
    
    // Monitor DOM changes to update links in dynamically added content
    try {
      const observer = new MutationObserver((mutations) => {
        let shouldUpdateLinks = false;
        
        // Check if any links were added
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // ELEMENT_NODE
              const element = node as Element;
              if (element.tagName === 'A' || element.querySelectorAll('a').length > 0) {
                shouldUpdateLinks = true;
              }
            }
          });
        });
        
        if (shouldUpdateLinks) {
          safeUpdateLinks();
        }
      });
      
      // Start observing
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
      
      // Clean up
      return () => {
        observer.disconnect();
      };
    } catch (error) {
      console.error("Error setting up MutationObserver:", error);
      
      // Fallback: update links on intervals
      const interval = setInterval(safeUpdateLinks, 2000);
      return () => clearInterval(interval);
    }
  }, [language]);
  
  // This component doesn't render anything
  return null;
};
