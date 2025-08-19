
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { additionalTranslations } from './additionalTranslations';
import { translations } from './translations';
import { 
  getUserLanguagePreference, 
  setUserLanguagePreference, 
  getTextDirection, 
  updatePageMetadata,
  updatePageLinks
} from './languageUtils';
import { useLanguageSync } from '@/hooks/use-language-sync';

// Available languages
export type Language = 'fr' | 'ar';

// Translation dictionary type
export type TranslationSet = {
  fr: string;
  ar: string;
};

export type Translations = {
  [key: string]: TranslationSet | {
    [nestedKey: string]: TranslationSet | any;
  };
};

// Create a merged translations type that combines both translation objects
// instead of trying to enforce an exact match, we'll use a more flexible approach
export type MergedTranslationsType = typeof translations & Partial<typeof additionalTranslations>;

// Merge the translations with a deep merge function to handle nested structures properly
const mergeTranslations = (target: any, source: any): any => {
  const result = { ...target };
  
  for (const key in source) {
    // If property is an object and not a translation set (which has fr, ar keys)
    if (source[key] && typeof source[key] === 'object' && 
        !('fr' in source[key] && 'ar' in source[key])) {
      result[key] = result[key] ? mergeTranslations(result[key], source[key]) : { ...source[key] };
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
};

// Merge the translations using our custom deep merge function
const mergedTranslations = mergeTranslations(translations, additionalTranslations);

// Define the language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  direction: 'ltr' | 'rtl';
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [language, setLanguage] = useState<Language>(getUserLanguagePreference);
  const direction = getTextDirection(language);
  
  // Use the language sync hook to handle cross-tab synchronization
  useLanguageSync(language, updateLanguage);
  
  // This effect runs when the component mounts or when the URL changes
  useEffect(() => {
    // Get language from URL when the path changes
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam && ['fr', 'ar'].includes(langParam) && langParam !== language) {
      setLanguage(langParam as Language);
    } else if (!langParam && language) {
      // Update URL if language param is missing
      const url = new URL(window.location.href);
      url.searchParams.set('lang', language);
      window.history.replaceState(null, '', url);
    }
  }, [location.search, location.pathname]);
  
  // Handle language change
  function updateLanguage(newLanguage: Language) {
    if (newLanguage !== language) {
      // Update state
      setLanguage(newLanguage);
      
      // Update localStorage and URL
      setUserLanguagePreference(newLanguage);
      
      // Update all links with new language parameter
      updatePageLinks(newLanguage);
      
      // Log language change (in development)
      if (process.env.NODE_ENV === 'development') {
        console.log(`Language changed to: ${newLanguage}`);
      }
    }
  }
  
  // Update document direction and language attributes
  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
    
    // Update all links with current language
    updatePageLinks(language);
    
    // Try to determine current page for metadata updates
    const pathname = window.location.pathname;
    let pageName = 'home';
    
    if (pathname.includes('/about')) {
      pageName = 'about';
    } else if (pathname.includes('/shop')) {
      pageName = 'shop';
    } else if (pathname.includes('/contact')) {
      pageName = 'contact';
    } else if (pathname.includes('/cart')) {
      pageName = 'cart';
    } else if (pathname.includes('/checkout')) {
      pageName = 'checkout';
    }
    
    // Update metadata based on current page
    updatePageMetadata(language, pageName, mergedTranslations);
  }, [language, direction]);
  
  // Translation function with parameter support
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let translation: any = mergedTranslations;
    
    // Try to get nested translation
    for (let i = 0; i < keys.length - 1; i++) {
      if (translation[keys[i]]) {
        translation = translation[keys[i]];
      } else {
        return params?.default as string || key; // Key not found, use default or key itself
      }
    }
    
    // Get the actual translation
    const finalKey = keys[keys.length - 1];
    if (translation[finalKey] && translation[finalKey][language]) {
      let translatedText = translation[finalKey][language];
      
      // Replace parameters if provided
      if (params) {
        Object.keys(params).forEach(param => {
          if (param !== 'default') {
            translatedText = translatedText.replace(`{{${param}}}`, String(params[param]));
          }
        });
      }
      
      return translatedText;
    }
    
    return params?.default as string || key; // Fallback to default or key
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage, t, direction }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
