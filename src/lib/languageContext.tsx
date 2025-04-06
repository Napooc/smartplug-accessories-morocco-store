
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Available languages
export type Language = 'en' | 'fr' | 'ar';

// Translation dictionary type
export type Translations = {
  [key: string]: {
    en: string;
    fr: string;
    ar: string;
  };
};

// Common translations used across the app
export const translations: Translations = {
  home: {
    en: 'Home',
    fr: 'Accueil',
    ar: 'الرئيسية'
  },
  shop: {
    en: 'Shop',
    fr: 'Boutique',
    ar: 'المتجر'
  },
  about: {
    en: 'About',
    fr: 'À propos',
    ar: 'حول'
  },
  contact: {
    en: 'Contact',
    fr: 'Contact',
    ar: 'اتصل بنا'
  },
  search: {
    en: 'Search products...',
    fr: 'Rechercher des produits...',
    ar: 'البحث عن المنتجات...'
  },
  placeOrder: {
    en: 'Place Order',
    fr: 'Passer la commande',
    ar: 'تقديم الطلب'
  },
  cart: {
    en: 'Cart',
    fr: 'Panier',
    ar: 'عربة التسوق'
  },
  orderSummary: {
    en: 'Order Summary',
    fr: 'Résumé de la commande',
    ar: 'ملخص الطلب'
  },
  total: {
    en: 'Total',
    fr: 'Total',
    ar: 'المجموع'
  },
  shippingInfo: {
    en: 'Shipping Information',
    fr: 'Informations de livraison',
    ar: 'معلومات الشحن'
  },
  fullName: {
    en: 'Full Name',
    fr: 'Nom complet',
    ar: 'الاسم الكامل'
  },
  phone: {
    en: 'Phone Number',
    fr: 'Numéro de téléphone',
    ar: 'رقم الهاتف'
  },
  city: {
    en: 'City',
    fr: 'Ville',
    ar: 'المدينة'
  },
  admin: {
    en: 'Admin',
    fr: 'Admin',
    ar: 'المشرف'
  },
  login: {
    en: 'Login',
    fr: 'Connexion',
    ar: 'تسجيل الدخول'
  },
  logout: {
    en: 'Logout',
    fr: 'Déconnexion',
    ar: 'تسجيل الخروج'
  },
  // Additional translations for Checkout page
  nickname: {
    en: 'Nickname (Optional)',
    fr: 'Surnom (Optionnel)',
    ar: 'اللقب (اختياري)'
  },
  enterNickname: {
    en: 'Enter a nickname (for delivery person)',
    fr: 'Entrez un surnom (pour le livreur)',
    ar: 'أدخل لقبًا (لعامل التوصيل)'
  },
  processing: {
    en: 'Processing...',
    fr: 'Traitement en cours...',
    ar: 'جاري المعالجة...'
  },
  quantity: {
    en: 'Qty',
    fr: 'Qté',
    ar: 'الكمية'
  },
  cashOnDelivery: {
    en: '* Cash on delivery - Pay when you receive your order',
    fr: '* Paiement à la livraison - Payez à la réception de votre commande',
    ar: '* الدفع عند الاستلام - ادفع عند استلام طلبك'
  },
  freeShipping: {
    en: '* Free shipping for orders over 500 DH',
    fr: '* Livraison gratuite pour les commandes de plus de 500 DH',
    ar: '* شحن مجاني للطلبات التي تزيد عن 500 درهم'
  },
  fillAllFields: {
    en: 'Please fill in all required fields',
    fr: 'Veuillez remplir tous les champs obligatoires',
    ar: 'يرجى ملء جميع الحقول المطلوبة'
  },
  emptyCart: {
    en: 'Your cart is empty. Add some products before checkout.',
    fr: 'Votre panier est vide. Ajoutez des produits avant de passer à la caisse.',
    ar: 'سلة التسوق فارغة. أضف بعض المنتجات قبل الدفع.'
  },
  orderError: {
    en: 'An error occurred during checkout. Please try again.',
    fr: 'Une erreur s\'est produite lors du paiement. Veuillez réessayer.',
    ar: 'حدث خطأ أثناء الدفع. حاول مرة اخرى.'
  },
  selectCity: {
    en: 'Select a city',
    fr: 'Sélectionnez une ville',
    ar: 'اختر مدينة'
  }
};

// Create the context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with browser language or default to English
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('smartplug-language');
    if (savedLang && ['en', 'fr', 'ar'].includes(savedLang)) {
      return savedLang as Language;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'fr') return 'fr';
    if (browserLang === 'ar') return 'ar';
    return 'en';
  });
  
  // Update direction based on language
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  
  // Update document direction and save language to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
    
    // Apply RTL-specific styles if needed
    if (direction === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    localStorage.setItem('smartplug-language', language);
  }, [language, direction]);
  
  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let translation = translations;
    
    // Try to get nested translation
    for (let i = 0; i < keys.length - 1; i++) {
      if (translation[keys[i]]) {
        translation = translation[keys[i]] as unknown as Translations;
      } else {
        return key; // Key not found
      }
    }
    
    // Get the actual translation
    const finalKey = keys[keys.length - 1];
    if (translation[finalKey] && translation[finalKey][language]) {
      return translation[finalKey][language];
    }
    
    return key; // Fallback to key
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, direction }}>
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
