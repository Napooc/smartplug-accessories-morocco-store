
import { Language } from "./languageContext";

/**
 * Gets the user's language preference with the following priority:
 * 1. URL parameter
 * 2. LocalStorage
 * 3. Browser language
 * 4. Default (en)
 */
export const getUserLanguagePreference = (): Language => {
  // Check URL parameter first
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam && ['en', 'fr', 'ar'].includes(langParam)) {
      return langParam as Language;
    }
  } catch (error) {
    console.error("Error checking URL for language:", error);
  }
  
  // Then check localStorage
  try {
    const savedLang = localStorage.getItem('ma7alkom-language');
    if (savedLang && ['en', 'fr', 'ar'].includes(savedLang)) {
      return savedLang as Language;
    }
  } catch (error) {
    console.error("Error checking localStorage for language:", error);
  }
  
  // Then check browser language
  try {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'fr') return 'fr';
    if (browserLang === 'ar') return 'ar';
  } catch (error) {
    console.error("Error checking browser language:", error);
  }
  
  // Default to English
  return 'en';
};

/**
 * Updates the language in localStorage and returns a URL with the updated lang parameter
 * (Instead of directly modifying location.href which causes security errors in an iframe)
 */
export const setUserLanguagePreference = (language: Language): void => {
  // Update localStorage
  try {
    localStorage.setItem('ma7alkom-language', language);
  } catch (error) {
    console.error("Error saving language to localStorage:", error);
  }
  
  // Don't modify URL here - we'll use React Router and history.replaceState instead
};

/**
 * Gets the text direction based on language
 */
export const getTextDirection = (language: Language): 'ltr' | 'rtl' => {
  return language === 'ar' ? 'rtl' : 'ltr';
};

/**
 * Updates page metadata based on language and current page
 */
export const updatePageMetadata = (language: Language, pageName: string, translations: any): void => {
  try {
    // Update document title
    if (translations.seoTitles?.[pageName]) {
      document.title = translations.seoTitles[pageName][language];
    }
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && translations.seoDescriptions?.[pageName]) {
      metaDescription.setAttribute('content', translations.seoDescriptions[pageName][language]);
    }
    
    // Update OG title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && translations.seoTitles?.[pageName]) {
      ogTitle.setAttribute('content', translations.seoTitles[pageName][language]);
    }
    
    // Update OG description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && translations.seoDescriptions?.[pageName]) {
      ogDescription.setAttribute('content', translations.seoDescriptions[pageName][language]);
    }
  } catch (error) {
    console.error("Error updating page metadata:", error);
  }
};

/**
 * Adds language parameter to all internal links on the page
 * (Modified to use a safer approach)
 */
export const updatePageLinks = (language: Language): void => {
  try {
    document.querySelectorAll('a').forEach(link => {
      // Only modify internal links (not external ones)
      if (link.href && link.href.startsWith(window.location.origin)) {
        // Use URLSearchParams instead of directly manipulating href
        const url = new URL(link.href);
        url.searchParams.set('lang', language);
        link.setAttribute('href', url.toString());
      }
    });
  } catch (error) {
    console.error("Error updating page links:", error);
  }
};

/**
 * Returns a URL with the current language parameter
 */
export const getLocalizedUrl = (path: string, language: Language): string => {
  try {
    const url = new URL(path, window.location.origin);
    url.searchParams.set('lang', language);
    return url.toString();
  } catch (error) {
    console.error("Error creating localized URL:", error);
    // Return the original path with a query parameter
    return `${path}${path.includes('?') ? '&' : '?'}lang=${language}`;
  }
};
