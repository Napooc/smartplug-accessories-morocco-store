
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './lib/languageContext.tsx'
import { StoreProvider } from './lib/store'

// Function to get language parameter from URL
const getLanguageFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  return langParam && ['en', 'fr', 'ar'].includes(langParam) ? langParam : null;
};

// Initialize language before rendering
const initialLanguage = getLanguageFromUrl() || localStorage.getItem('ma7alkom-language') || 'en';
localStorage.setItem('ma7alkom-language', initialLanguage);

// Update URL if language param is missing but exists in localStorage
if (!getLanguageFromUrl() && initialLanguage) {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', initialLanguage);
  window.history.replaceState(null, '', url);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
