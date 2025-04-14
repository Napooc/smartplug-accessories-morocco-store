
import { useEffect } from 'react';
import { Language } from '@/lib/languageContext';
import { getUserLanguagePreference, setUserLanguagePreference } from '@/lib/languageUtils';

/**
 * This hook syncs language settings across tabs and handles browser back/forward navigation.
 */
export const useLanguageSync = (
  language: Language, 
  setLanguage: (lang: Language) => void
) => {
  // Listen for popstate events (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      
      if (langParam && ['en', 'fr', 'ar'].includes(langParam) && langParam !== language) {
        setLanguage(langParam as Language);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [language, setLanguage]);
  
  // Listen for storage events (other tabs)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'ma7alkom-language' && event.newValue) {
        const newLang = event.newValue as Language;
        if (newLang !== language) {
          setLanguage(newLang);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [language, setLanguage]);
  
  // Handle window focus events to check for language changes in other tabs
  useEffect(() => {
    const handleWindowFocus = () => {
      const storedLang = localStorage.getItem('ma7alkom-language') as Language;
      if (storedLang && storedLang !== language) {
        setLanguage(storedLang);
      }
    };
    
    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [language, setLanguage]);
};
