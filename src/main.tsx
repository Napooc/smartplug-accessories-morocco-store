
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

// Add a listener for storage events to sync language between tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'ma7alkom-language' && event.newValue) {
    try {
      // Only reload if the language is different from current URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const currentLang = urlParams.get('lang');
      
      if (currentLang !== event.newValue) {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', event.newValue);
        
        // Use history API instead of direct location change
        window.history.replaceState(null, '', url.toString());
        
        // Reload only in extreme cases or trigger a state update
        // window.location.reload(); // This line is commented out to avoid reloads
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
