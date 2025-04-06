
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
  // Add more translations for the rest of the website
  yourCart: {
    en: 'Your cart is empty',
    fr: 'Votre panier est vide',
    ar: 'عربة التسوق فارغة'
  },
  noItemsAdded: {
    en: 'Looks like you haven\'t added any items to your cart yet.',
    fr: 'Il semble que vous n\'ayez pas encore ajouté d\'articles à votre panier.',
    ar: 'يبدو أنك لم تضف أي منتجات إلى عربة التسوق بعد.'
  },
  continueShopping: {
    en: 'Continue Shopping',
    fr: 'Continuer vos achats',
    ar: 'مواصلة التسوق'
  },
  shoppingCart: {
    en: 'Shopping Cart',
    fr: 'Panier d\'achat',
    ar: 'عربة التسوق'
  },
  product: {
    en: 'Product',
    fr: 'Produit',
    ar: 'المنتج'
  },
  price: {
    en: 'Price',
    fr: 'Prix',
    ar: 'السعر'
  },
  quantity: {
    en: 'Quantity',
    fr: 'Quantité',
    ar: 'الكمية'
  },
  cartSummary: {
    en: 'Cart Summary',
    fr: 'Résumé du panier',
    ar: 'ملخص عربة التسوق'
  },
  subtotal: {
    en: 'Subtotal',
    fr: 'Sous-total',
    ar: 'المجموع الفرعي'
  },
  shipping: {
    en: 'Shipping',
    fr: 'Livraison',
    ar: 'الشحن'
  },
  free: {
    en: 'Free',
    fr: 'Gratuit',
    ar: 'مجاني'
  },
  proceedToCheckout: {
    en: 'Proceed to Checkout',
    fr: 'Passer à la caisse',
    ar: 'المتابعة إلى الدفع'
  },
  weAccept: {
    en: 'We Accept',
    fr: 'Nous acceptons',
    ar: 'نحن نقبل'
  },
  cashOnDelivery: {
    en: 'Cash on Delivery',
    fr: 'Paiement à la livraison',
    ar: 'الدفع عند الاستلام'
  },
  applyDiscount: {
    en: 'Apply Coupon',
    fr: 'Appliquer un coupon',
    ar: 'تطبيق الكوبون'
  },
  discountCode: {
    en: 'Coupon code',
    fr: 'Code de coupon',
    ar: 'رمز الكوبون'
  },
  nickname: {
    en: 'Nickname (Optional)',
    fr: 'Pseudo (Optionnel)',
    ar: 'اللقب (اختياري)'
  },
  enterNickname: {
    en: 'Enter a nickname (for delivery person)',
    fr: 'Entrez un pseudo (pour le livreur)',
    ar: 'أدخل لقبًا (للشخص الذي يقوم بالتوصيل)'
  },
  processing: {
    en: 'Processing...',
    fr: 'Traitement en cours...',
    ar: 'جاري المعالجة...'
  },
  emptyCart: {
    en: 'Your cart is empty. Add some products before checkout.',
    fr: 'Votre panier est vide. Ajoutez des produits avant de passer à la caisse.',
    ar: 'عربة التسوق فارغة. أضف بعض المنتجات قبل الدفع.'
  },
  thankYou: {
    en: 'Thank You!',
    fr: 'Merci!',
    ar: 'شكرًا لك!'
  },
  orderPlaced: {
    en: 'Your order has been placed successfully.',
    fr: 'Votre commande a été passée avec succès.',
    ar: 'تم تقديم طلبك بنجاح.'
  },
  orderId: {
    en: 'Order ID:',
    fr: 'Numéro de commande:',
    ar: 'رقم الطلب:'
  },
  orderDetails: {
    en: 'Order Details',
    fr: 'Détails de la commande',
    ar: 'تفاصيل الطلب'
  },
  orderReceived: {
    en: 'Your order has been received and is now being processed. You will receive a confirmation call shortly.',
    fr: 'Votre commande a été reçue et est en cours de traitement. Vous recevrez un appel de confirmation sous peu.',
    ar: 'تم استلام طلبك وهو قيد المعالجة الآن. ستتلقى مكالمة تأكيد قريبًا.'
  },
  paymentMethod: {
    en: 'Payment method:',
    fr: 'Méthode de paiement:',
    ar: 'طريقة الدفع:'
  },
  backToHomepage: {
    en: 'Back to Homepage',
    fr: 'Retour à l\'accueil',
    ar: 'العودة إلى الصفحة الرئيسية'
  },
  getInTouch: {
    en: 'Get In Touch',
    fr: 'Contactez-nous',
    ar: 'تواصل معنا'
  },
  contactIntro: {
    en: 'Have questions about our products or services? We\'re here to help! Reach out to us using any of the methods below.',
    fr: 'Vous avez des questions sur nos produits ou services? Nous sommes là pour vous aider! Contactez-nous en utilisant l\'une des méthodes ci-dessous.',
    ar: 'هل لديك أسئلة حول منتجاتنا أو خدماتنا؟ نحن هنا للمساعدة! تواصل معنا باستخدام أي من الطرق أدناه.'
  },
  phoneTitle: {
    en: 'Phone',
    fr: 'Téléphone',
    ar: 'الهاتف'
  },
  emailTitle: {
    en: 'Email',
    fr: 'Email',
    ar: 'البريد الإلكتروني'
  },
  addressTitle: {
    en: 'Address',
    fr: 'Adresse',
    ar: 'العنوان'
  },
  sendMessage: {
    en: 'Send Us A Message',
    fr: 'Envoyez-nous un message',
    ar: 'أرسل لنا رسالة'
  },
  nameRequired: {
    en: 'Name is required',
    fr: 'Le nom est requis',
    ar: 'الاسم مطلوب'
  },
  emailRequired: {
    en: 'Email is required',
    fr: 'L\'email est requis',
    ar: 'البريد الإلكتروني مطلوب'
  },
  validEmail: {
    en: 'Please enter a valid email',
    fr: 'Veuillez entrer un email valide',
    ar: 'يرجى إدخال بريد إلكتروني صحيح'
  },
  messageRequired: {
    en: 'Message is required',
    fr: 'Le message est requis',
    ar: 'الرسالة مطلوبة'
  },
  yourName: {
    en: 'Your name',
    fr: 'Votre nom',
    ar: 'اسمك'
  },
  yourEmail: {
    en: 'Your email',
    fr: 'Votre email',
    ar: 'بريدك الإلكتروني'
  },
  subjectOptional: {
    en: 'Subject (Optional)',
    fr: 'Sujet (Optionnel)',
    ar: 'الموضوع (اختياري)'
  },
  subjectPlaceholder: {
    en: 'Subject of your message',
    fr: 'Sujet de votre message',
    ar: 'موضوع رسالتك'
  },
  messagePlaceholder: {
    en: 'Your message',
    fr: 'Votre message',
    ar: 'رسالتك'
  },
  sendMessageButton: {
    en: 'Send Message',
    fr: 'Envoyer le message',
    ar: 'إرسال الرسالة'
  },
  messageSent: {
    en: 'Message sent successfully! We will get back to you soon.',
    fr: 'Message envoyé avec succès! Nous vous répondrons bientôt.',
    ar: 'تم إرسال الرسالة بنجاح! سنعاود الاتصال بك قريبًا.'
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
