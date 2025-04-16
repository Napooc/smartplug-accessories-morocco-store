
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './lib/languageContext.tsx'
import { getUserLanguagePreference, setUserLanguagePreference } from './lib/languageUtils'

// Initialize language before rendering
const initialLanguage = getUserLanguagePreference();
setUserLanguagePreference(initialLanguage);

// Modified storage event listener to use History API instead of direct location changes
window.addEventListener('storage', (event) => {
  if (event.key === 'ma7alkom-language' && event.newValue) {
    try {
      // Only update if the language is different from current URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const currentLang = urlParams.get('lang');
      
      if (currentLang !== event.newValue) {
        // Use history API instead of direct location change
        const url = new URL(window.location.href);
        url.searchParams.set('lang', event.newValue);
        window.history.replaceState(null, '', url.toString());
        
        // We'll avoid reloading and instead rely on context updates
      }
    } catch (error) {
      console.error("Error handling language storage event:", error);
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
