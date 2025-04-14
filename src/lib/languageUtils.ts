
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
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  
  if (langParam && ['en', 'fr', 'ar'].includes(langParam)) {
    return langParam as Language;
  }
  
  // Then check localStorage
  const savedLang = localStorage.getItem('ma7alkom-language');
  if (savedLang && ['en', 'fr', 'ar'].includes(savedLang)) {
    return savedLang as Language;
  }
  
  // Then check browser language
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'fr') return 'fr';
  if (browserLang === 'ar') return 'ar';
  
  // Default to English
  return 'en';
};

/**
 * Updates the language in both localStorage and URL
 */
export const setUserLanguagePreference = (language: Language): void => {
  // Update localStorage
  localStorage.setItem('ma7alkom-language', language);
  
  // Update URL parameter without page reload
  const url = new URL(window.location.href);
  url.searchParams.set('lang', language);
  window.history.replaceState(null, '', url);
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
};

/**
 * Adds language parameter to all internal links on the page
 */
export const updatePageLinks = (language: Language): void => {
  document.querySelectorAll('a').forEach(link => {
    // Only modify internal links (not external ones)
    if (link.href.startsWith(window.location.origin)) {
      const url = new URL(link.href);
      url.searchParams.set('lang', language);
      link.href = url.toString();
    }
  });
};

/**
 * Returns a URL with the current language parameter
 */
export const getLocalizedUrl = (path: string, language: Language): string => {
  const url = new URL(path, window.location.origin);
  url.searchParams.set('lang', language);
  return url.toString();
};
