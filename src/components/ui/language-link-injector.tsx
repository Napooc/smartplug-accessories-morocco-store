
import React, { useEffect } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { updatePageLinks } from '@/lib/languageUtils';

/**
 * This component automatically adds language parameters to all links on the page.
 * It should be used in the Layout component to ensure all links have the language parameter.
 */
export const LanguageLinkInjector: React.FC = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Update links when language changes
    updatePageLinks(language);
    
    // Monitor DOM changes to update links in dynamically added content
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
        updatePageLinks(language);
      }
    });
    
    // Start observing
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Add listener for single page app navigation
    const handleClick = (e: MouseEvent) => {
      // Wait a small amount of time for route change to complete
      setTimeout(() => {
        updatePageLinks(language);
      }, 100);
    };
    
    document.body.addEventListener('click', handleClick);
    
    // Clean up
    return () => {
      observer.disconnect();
      document.body.removeEventListener('click', handleClick);
    };
  }, [language]);
  
  // This component doesn't render anything
  return null;
};
