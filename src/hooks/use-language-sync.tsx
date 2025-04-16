
import { useEffect } from 'react';
import { Language } from '@/lib/languageContext';
import { getUserLanguagePreference } from '@/lib/languageUtils';

/**
 * This hook syncs language settings across tabs and handles browser back/forward navigation.
 * Modified to avoid direct window.location manipulation.
 */
export const useLanguageSync = (
  language: Language, 
  setLanguage: (lang: Language) => void
) => {
  // Listen for popstate events (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        if (langParam && ['en', 'fr', 'ar'].includes(langParam) && langParam !== language) {
          setLanguage(langParam as Language);
        }
      } catch (error) {
        console.error("Error handling popstate event:", error);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [language, setLanguage]);
  
  // Listen for storage events (other tabs)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      try {
        if (event.key === 'ma7alkom-language' && event.newValue) {
          const newLang = event.newValue as Language;
          if (newLang !== language) {
            setLanguage(newLang);
          }
        }
      } catch (error) {
        console.error("Error handling storage event:", error);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [language, setLanguage]);
  
  // Handle window focus events to check for language changes in other tabs
  useEffect(() => {
    const handleWindowFocus = () => {
      try {
        const storedLang = localStorage.getItem('ma7alkom-language') as Language;
        if (storedLang && storedLang !== language) {
          setLanguage(storedLang);
        }
      } catch (error) {
        console.error("Error handling window focus event:", error);
      }
    };
    
    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [language, setLanguage]);
};
