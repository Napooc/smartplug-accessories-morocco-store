import { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

type Language = 'en' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial language from query params or default to 'en'
  const initialLanguage = (searchParams.get('lang') as Language) || 'en';
  const [language, setLanguage] = React.useState<Language>(initialLanguage);
  
  // Update language and query params
  const updateLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('lang', newLanguage);
    
    // Update the URL without triggering a full page reload
    router.push(`?${newParams.toString()}`, { scroll: false });
  };
  
  const translations = {
    en: {
      home: 'Home',
      about: 'About',
      shop: 'Shop',
      contact: 'Contact',
      cart: 'Cart',
      categories: 'Categories',
      search: 'Search',
      
      // Product Detail Page
      description: 'Description',
      additionalInfo: 'Additional Information',
      reviews: 'Reviews',
      addToCart: 'Add to Cart',
      
      // Cart Page
      yourCart: 'Your Cart',
      quantity: 'Quantity',
      price: 'Price',
      total: 'Total',
      updateCart: 'Update Cart',
      checkout: 'Checkout',
      emptyCart: 'Your cart is currently empty.',
      continueShopping: 'Continue Shopping',
      
      // Checkout Page
      shippingInfo: 'Shipping Information',
      fullName: 'Full Name',
      phone: 'Phone',
      city: 'City',
      address: 'Address',
      orderSummary: 'Order Summary',
      placeOrder: 'Place Order',
      cashOnDelivery: 'Cash on delivery',
      free: 'Free',
      shipping: 'shipping',
      processing: 'Processing...',
      orderConfirmation: 'Order Confirmation',
      orderNumber: 'Order Number',
      thankYouMessage: 'Thank you for your order!',
      confirmationMessage: 'A confirmation email has been sent to your email address.',
      viewOrderDetails: 'View Order Details',
      continueShoppingBtn: 'Continue Shopping',
      orderFailed: 'Failed to place order. Please try again.',
      nickname: 'Nickname',
      enterNickname: 'Enter your nickname',
      
      // Contact Page
      getInTouch: 'Get in Touch',
      contactIntro: 'We are here to help! Contact us for any inquiries or support.',
      phoneTitle: 'Phone',
      emailTitle: 'Email',
      addressTitle: 'Address',
      sendMessage: 'Send us a Message',
      fullNameLabel: 'Full Name',
      emailLabel: 'Email Address',
      subjectOptional: 'Subject (Optional)',
      subjectPlaceholder: 'Enter Subject',
      message: 'Message',
      yourName: 'Your Name',
      yourEmail: 'Your Email',
      messagePlaceholder: 'Your Message',
      sendMessageButton: 'Send Message',
      nameRequired: 'Name is required',
      emailRequired: 'Email is required',
      validEmail: 'Please enter a valid email',
      messageRequired: 'Message is required',
      messageSent: 'Message sent successfully!',
      messageFailed: 'Failed to send message. Please try again.',
      
      // Admin
      adminLogin: 'Admin Login',
      username: 'Username',
      password: 'Password',
      login: 'Login',
      dashboard: 'Dashboard',
      orders: 'Orders',
      products: 'Products',
      logout: 'Logout',
      
      // Not Found Page
      pageNotFound: 'Page Not Found',
      returnHome: 'Return to Home',
      
      thankYou: 'Thank You!',
      messageReceived: 'Your message has been received. Our team will get back to you soon.',
      sendAnotherMessage: 'Send Another Message',
      sending: 'Sending...',
    },
    fr: {
      home: 'Accueil',
      about: 'À propos',
      shop: 'Boutique',
      contact: 'Contact',
      cart: 'Panier',
      categories: 'Catégories',
      search: 'Rechercher',
      
      // Product Detail Page
      description: 'Description',
      additionalInfo: 'Informations complémentaires',
      reviews: 'Avis',
      addToCart: 'Ajouter au panier',
      
      // Cart Page
      yourCart: 'Votre panier',
      quantity: 'Quantité',
      price: 'Prix',
      total: 'Total',
      updateCart: 'Mettre à jour le panier',
      checkout: 'Commander',
      emptyCart: 'Votre panier est vide.',
      continueShopping: 'Continuer vos achats',
      
      // Checkout Page
      shippingInfo: 'Informations de livraison',
      fullName: 'Nom complet',
      phone: 'Téléphone',
      city: 'Ville',
      address: 'Adresse',
      orderSummary: 'Récapitulatif de la commande',
      placeOrder: 'Passer la commande',
      cashOnDelivery: 'Paiement à la livraison',
      free: 'Gratuit',
      shipping: 'livraison',
      processing: 'En cours de traitement...',
      orderConfirmation: 'Confirmation de commande',
      orderNumber: 'Numéro de commande',
      thankYouMessage: 'Merci pour votre commande !',
      confirmationMessage: 'Un e-mail de confirmation a été envoyé à votre adresse e-mail.',
      viewOrderDetails: 'Voir les détails de la commande',
      continueShoppingBtn: 'Continuer vos achats',
      orderFailed: 'Échec de la commande. Veuillez réessayer.',
      nickname: 'Surnom',
      enterNickname: 'Entrez votre surnom',
      
      // Contact Page
      getInTouch: 'Contactez-nous',
      contactIntro: 'Nous sommes là pour vous aider ! Contactez-nous pour toute question ou assistance.',
      phoneTitle: 'Téléphone',
      emailTitle: 'E-mail',
      addressTitle: 'Adresse',
      sendMessage: 'Envoyez-nous un message',
      fullNameLabel: 'Nom complet',
      emailLabel: 'Adresse e-mail',
      subjectOptional: 'Sujet (facultatif)',
      subjectPlaceholder: 'Entrez le sujet',
      message: 'Message',
      yourName: 'Votre nom',
      yourEmail: 'Votre e-mail',
      messagePlaceholder: 'Votre message',
      sendMessageButton: 'Envoyer le message',
      nameRequired: 'Le nom est obligatoire',
      emailRequired: "L'email est obligatoire",
      validEmail: 'Veuillez entrer un email valide',
      messageRequired: 'Le message est obligatoire',
      messageSent: 'Message envoyé avec succès!',
      messageFailed: 'Échec de l\'envoi du message. Veuillez réessayer.',
      
      // Admin
      adminLogin: 'Connexion Admin',
      username: "Nom d'utilisateur",
      password: 'Mot de passe',
      login: 'Se connecter',
      dashboard: 'Tableau de bord',
      orders: 'Commandes',
      products: 'Produits',
      logout: 'Se déconnecter',
      
      // Not Found Page
      pageNotFound: 'Page non trouvée',
      returnHome: 'Retour à la page d\'accueil',
      
      thankYou: 'Merci!',
      messageReceived: 'Votre message a été reçu. Notre équipe vous contactera bientôt.',
      sendAnotherMessage: 'Envoyer un autre message',
      sending: 'Envoi en cours...',
    },
    ar: {
      home: 'الرئيسية',
      about: 'حول',
      shop: 'المتجر',
      contact: 'اتصل بنا',
      cart: 'السلة',
      categories: 'الفئات',
      search: 'بحث',
      
      // Product Detail Page
      description: 'الوصف',
      additionalInfo: 'معلومات إضافية',
      reviews: 'التقييمات',
      addToCart: 'أضف إلى السلة',
      
      // Cart Page
      yourCart: 'سلتك',
      quantity: 'الكمية',
      price: 'السعر',
      total: 'المجموع',
      updateCart: 'تحديث السلة',
      checkout: 'إتمام الشراء',
      emptyCart: 'سلتك فارغة حاليا.',
      continueShopping: 'متابعة التسوق',
      
      // Checkout Page
      shippingInfo: 'معلومات الشحن',
      fullName: 'الاسم الكامل',
      phone: 'الهاتف',
      city: 'المدينة',
      address: 'العنوان',
      orderSummary: 'ملخص الطلب',
      placeOrder: 'تأكيد الطلب',
      cashOnDelivery: 'الدفع عند الاستلام',
      free: 'مجانا',
      shipping: 'الشحن',
      processing: 'جاري المعالجة...',
      orderConfirmation: 'تأكيد الطلب',
      orderNumber: 'رقم الطلب',
      thankYouMessage: 'شكرا لك على طلبك!',
      confirmationMessage: 'تم إرسال رسالة تأكيد إلى عنوان بريدك الإلكتروني.',
      viewOrderDetails: 'عرض تفاصيل الطلب',
      continueShoppingBtn: 'متابعة التسوق',
      orderFailed: 'فشل في تقديم الطلب. يرجى المحاولة مرة أخرى.',
      nickname: 'اسم الشهرة',
      enterNickname: 'أدخل اسم الشهرة',
      
      // Contact Page
      getInTouch: 'تواصل معنا',
      contactIntro: 'نحن هنا للمساعدة! اتصل بنا لأية استفسارات أو دعم.',
      phoneTitle: 'الهاتف',
      emailTitle: 'البريد الإلكتروني',
      addressTitle: 'العنوان',
      sendMessage: 'أرسل لنا رسالة',
      fullNameLabel: 'الاسم الكامل',
      emailLabel: 'عنوان البريد الإلكتروني',
      subjectOptional: 'الموضوع (اختياري)',
      subjectPlaceholder: 'أدخل الموضوع',
      message: 'الرسالة',
      yourName: 'اسمك',
      yourEmail: 'بريدك الإلكتروني',
      messagePlaceholder: 'رسالتك',
      sendMessageButton: 'أرسل الرسالة',
      nameRequired: 'الاسم مطلوب',
      emailRequired: 'البريد الإلكتروني مطلوب',
      validEmail: 'الرجاء إدخال بريد إلكتروني صالح',
      messageRequired: 'الرسالة مطلوبة',
      messageSent: 'تم إرسال الرسالة بنجاح!',
      messageFailed: 'فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
      
      // Admin
      adminLogin: 'تسجيل دخول المسؤول',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      login: 'تسجيل الدخول',
      dashboard: 'لوحة التحكم',
      orders: 'الطلبات',
      products: 'المنتجات',
      logout: 'تسجيل الخروج',
      
      // Not Found Page
      pageNotFound: 'الصفحة غير موجودة',
      returnHome: 'العودة إلى الرئيسية',
      
      thankYou: 'شكرا لك!',
      messageReceived: 'تم استلام رسالتك. سيتواصل فريقنا معك قريبًا.',
      sendAnotherMessage: 'إرسال رسالة أخرى',
      sending: 'جاري الإرسال...',
    }
  };
  
  const t = (key: string) => {
    return translations[language as keyof typeof translations]?.[key] || key;
  };
  
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  
  const value = {
    language,
    setLanguage: updateLanguage,
    t,
    direction,
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
