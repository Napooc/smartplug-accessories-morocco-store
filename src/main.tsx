
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './lib/languageContext.tsx'
import { StoreProvider } from './lib/store'
import { getUserLanguagePreference, setUserLanguagePreference } from './lib/languageUtils'

// Initialize language before rendering
const initialLanguage = getUserLanguagePreference();
setUserLanguagePreference(initialLanguage);

// Add a listener for storage events to sync language between tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'ma7alkom-language' && event.newValue) {
    // Only update URL parameter without full page reload
    const urlParams = new URLSearchParams(window.location.search);
    const currentLang = urlParams.get('lang');
    
    if (currentLang !== event.newValue) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', event.newValue);
      window.history.pushState({}, '', url.toString());
    }
  }
});

// Create root element eagerly
const root = createRoot(document.getElementById("root")!);

// Render without StrictMode for faster initial render
root.render(
  <BrowserRouter>
    <LanguageProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </LanguageProvider>
  </BrowserRouter>
);
