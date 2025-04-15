import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  // Header section
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
  
  // Service features translations
  fastFreeShipping: {
    en: 'Fast & Free Shipping',
    fr: 'Livraison rapide et gratuite',
    ar: 'شحن سريع ومجاني'
  },
  shippingDescription: {
    en: 'To all Moroccan cities in 24-48 hours.',
    fr: 'Vers toutes les villes marocaines en 24h-48h.',
    ar: 'إلى جميع المدن المغربية في 24-48 ساعة.'
  },
  tryBeforePay: {
    en: 'Try Before You Pay',
    fr: 'Essayer avant de payer',
    ar: 'جرب قبل أن تدفع'
  },
  tryBeforePayDesc: {
    en: 'Try them, pay only if you are satisfied.',
    fr: 'Essayez-les, Payez seulement si vous êtes satisfait.',
    ar: 'جربها، وادفع فقط إذا كنت راضيًا.'
  },
  customerSupport: {
    en: 'Customer Support',
    fr: 'Support Clientèle',
    ar: 'دعم العملاء'
  },
  customerSupportDesc: {
    en: 'Available to answer all your questions.',
    fr: 'Disponible pour répondre à toutes vos questions.',
    ar: 'متاح للإجابة على جميع أسئلتك.'
  },
  
  // Search related
  search: {
    en: 'Search products...',
    fr: 'Rechercher des produits...',
    ar: 'البحث عن المنتجات...'
  },
  searchProducts: {
    en: 'Search Products',
    fr: 'Rechercher des produits',
    ar: 'البحث عن المنتجات'
  },
  searchPlaceholder: {
    en: 'What are you looking for?',
    fr: 'Que cherchez-vous ?',
    ar: 'عما تبحث؟'
  },
  
  // Cart related
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
  
  // Admin related
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
  
  // Cart page
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
  
  // Featured Section
  featured: {
    en: 'Featured',
    fr: 'En vedette',
    ar: 'مميز'
  },
  viewAllProducts: {
    en: 'View All Products',
    fr: 'Voir tous les produits',
    ar: 'عرض جميع المنتجات'
  },
  
  // Category Grid
  shopByCategory: {
    en: 'Shop By Category',
    fr: 'Acheter par catégorie',
    ar: 'تسوق حسب الفئة'
  },
  shopByCategoryDesc: {
    en: 'Explore our wide range of products across different categories to find exactly what you need for your home',
    fr: 'Explorez notre large gamme de produits dans différentes catégories pour trouver exactement ce dont vous avez besoin pour votre maison',
    ar: 'استكشف مجموعتنا الواسعة من المنتجات عبر فئات مختلفة للعثور على ما تحتاجه بالضبط لمنزلك'
  },
  
  // Category page
  backToShop: {
    en: 'Back to Shop',
    fr: 'Retour à la boutique',
    ar: 'العودة إلى المتجر'
  },
  category: {
    en: 'Category',
    fr: 'Catégorie',
    ar: 'فئة'
  },
  thisCategory: {
    en: 'this category',
    fr: 'cette catégorie',
    ar: 'هذه الفئة'
  },
  noProductsFound: {
    en: 'No products found',
    fr: 'Aucun produit trouvé',
    ar: 'لم يتم العثور على منتجات'
  },
  noProductsInCategory: {
    en: 'There are no products in this category at the moment.',
    fr: 'Il n\'y a pas de produits dans cette catégorie pour le moment.',
    ar: 'لا توجد منتجات في هذه الفئة في الوقت الحالي.'
  },
  showingProducts: {
    en: 'Showing {{count}} products in {{category}}',
    fr: 'Affichage de {{count}} produits dans {{category}}',
    ar: 'عرض {{count}} منتجات في {{category}}'
  },
  
  // Categories
  categories: {
    en: 'Categories',
    fr: 'Catégories',
    ar: 'فئات'
  },
  homeKitchen: {
    en: 'Home & Kitchen',
    fr: 'Maison & Cuisine',
    ar: 'المنزل والمطبخ'
  },
  electronics: {
    en: 'Electronics',
    fr: 'Électronique',
    ar: 'الإلكترونيات'
  },
  toolsLighting: {
    en: 'Tools & Lighting',
    fr: 'Outils & Éclairage',
    ar: 'أدوات وإضاءة'
  },
  plumbing: {
    en: 'Plumbing',
    fr: 'Plomberie',
    ar: 'السباكة'
  },
  gardenTerrace: {
    en: 'Garden & Terrace',
    fr: 'Jardin & Terrasse',
    ar: 'الحديقة والشرفة'
  },
  paintHardware: {
    en: 'Paint & Hardware',
    fr: 'Peinture & Quincaillerie',
    ar: 'الطلاء والأجهزة'
  },
  bathroomToilet: {
    en: 'Bathroom & Toilet',
    fr: 'Salle de bain & Toilette',
    ar: 'الحمام والمرحاض'
  },
  heatingAc: {
    en: 'Heating & AC',
    fr: 'Chauffage & Climatisation',
    ar: 'التدفئة والتكييف'
  },
  
  // Checkout page
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
  
  // Order confirmation
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
  
  // Contact page
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
  },
  
  // Footer
  footerDescription: {
    en: 'At Ma7alkom, we\'re dedicated to providing you with the best in home accessories. Explore our wide range of products, from electronics to kitchen appliances and much more.',
    fr: 'Chez Ma7alkom, nous nous consacrons à vous fournir le meilleur en accessoires pour la maison. Explorez notre large gamme de produits, des appareils électroniques aux appareils de cuisine et bien plus encore.',
    ar: 'في محلكم، نحن ملتزمون بتوفير أفضل إكسسوارات المنزل. استكشف مجموعتنا الواسعة من المنتجات، من الإلكترونيات إلى أجهزة المطبخ والكثير غير ذلك.'
  },
  usefulLinks: {
    en: 'Useful Links',
    fr: 'Liens utiles',
    ar: 'روابط مفيدة'
  },
  quickLinks: {
    en: 'Quick Links',
    fr: 'Liens rapides',
    ar: 'روابط سريعة'
  },
  newsletter: {
    en: 'Newsletter',
    fr: 'Bulletin d\'information',
    ar: 'النشرة الإخبارية'
  },
  newsletterText: {
    en: 'Subscribe to our newsletter to get updates on our latest offers!',
    fr: 'Abonnez-vous à notre newsletter pour recevoir des mises à jour sur nos dernières offres!',
    ar: 'اشترك في نشرتنا الإخبارية للحصول على تحديثات حول أحدث عروضنا!'
  },
  enterEmail: {
    en: 'Enter your email',
    fr: 'Entrez votre email',
    ar: 'أدخل بريدك الإلكتروني'
  },
  subscribe: {
    en: 'Subscribe',
    fr: 'S\'abonner',
    ar: 'اشترك'
  },
  allRightsReserved: {
    en: 'All rights reserved.',
    fr: 'Tous droits réservés.',
    ar: 'جميع الحقوق محفوظة.'
  },
  privacyPolicy: {
    en: 'Privacy Policy',
    fr: 'Politique de confidentialité',
    ar: 'سياسة الخصوصية'
  },
  
  // Innovation showcase
  innovationHub: {
    en: 'Innovation Hub',
    fr: 'Hub d\'innovation',
    ar: 'مركز الابتكار'
  },
  nextGenPowerSolutions: {
    en: 'Next-Gen Power Solutions',
    fr: 'Solutions d\'alimentation de nouvelle génération',
    ar: 'حلول الطاقة من الجيل التالي'
  },
  powerSolutionsDesc: {
    en: 'Experience the future of charging with our innovative power solutions that charge your devices faster and smarter than ever before.',
    fr: 'Découvrez l\'avenir de la charge avec nos solutions d\'alimentation innovantes qui chargent vos appareils plus rapidement et plus intelligemment que jamais.',
    ar: 'اختبر مستقبل الشحن مع حلول الطاقة المبتكرة لدينا التي تشحن أجهزتك بشكل أسرع وأذكى من أي وقت مضى.'
  },
  explorePowerSolutions: {
    en: 'Explore Power Solutions',
    fr: 'Explorer les solutions d\'alimentation',
    ar: 'استكشف حلول الطاقة'
  },
  ultraFastCharging: {
    en: 'Ultra-Fast Charging',
    fr: 'Charge ultra rapide',
    ar: 'شحن فائق السرعة'
  },
  
  // Product related translations
  sale: {
    en: 'Sale',
    fr: 'Promo',
    ar: 'تخفيض'
  },
  addToCart: {
    en: 'Add to Cart',
    fr: 'Ajouter au panier',
    ar: 'أضف إلى السلة'
  },
  viewDetails: {
    en: 'View Details',
    fr: 'Voir les détails',
    ar: 'عرض التفاصيل'
  },
  bestSellingProducts: {
    en: 'Best-Selling Products',
    fr: 'Produits les plus vendus',
    ar: 'المنتجات الأكثر مبيعًا'
  },
  discoverBestProducts: {
    en: 'Discover our most loved products with exceptional quality and customer satisfaction',
    fr: 'Découvrez nos produits les plus appréciés avec une qualité exceptionnelle et la satisfaction des clients',
    ar: 'اكتشف منتجاتنا الأكثر شعبية بجودة استثنائية ورضا العملاء'
  },
  viewAll: {
    en: 'View All',
    fr: 'Voir tout',
    ar: 'عرض الكل'
  },
  
  // Discount Showcase translations
  specialOffers: {
    en: 'Special Offers',
    fr: 'Offres Spéciales',
    ar: 'عروض خاصة'
  },
  exclusiveDiscounts: {
    en: 'Exclusive Discounts',
    fr: 'Remises Exclusives',
    ar: 'خصومات حصرية'
  },
  discountDesc: {
    en: 'Limited time deals on our best products. Save up to 30% on selected items across our entire catalog.',
    fr: 'Offres à durée limitée sur nos meilleurs produits. Économisez jusqu\'à 30% sur des articles sélectionnés dans tout notre catalogue.',
    ar: 'صفقات لفترة محدودة على أفضل منتجاتنا. وفر حتى 30٪ على العناصر المختارة في جميع أنحاء الكتالوج بأكمله.'
  },
  freeShipping: {
    en: 'Free Shipping',
    fr: 'Livraison Gratuite',
    ar: 'شحن مجاني'
  },
  freeShippingDesc: {
    en: 'On all orders, no minimum purchase required',
    fr: 'Sur toutes les commandes, sans minimum d\'achat requis',
    ar: 'على جميع الطلبات، بدون حد أدنى للشراء'
  },
  freeShippingDetail: {
    en: 'We offer free shipping on all orders throughout Morocco.',
    fr: 'Nous offrons la livraison gratuite sur toutes les commandes au Maroc.',
    ar: 'نقدم شحنًا مجانيًا على جميع الطلبات في جميع أنحاء المغرب.'
  },
  fastDelivery: {
    en: 'Fast Delivery',
    fr: 'Livraison Rapide',
    ar: 'توصيل سريع'
  },
  fastDeliveryDesc: {
    en: 'Delivery between 1-3 business days',
    fr: 'Livraison entre 1-3 jours ouvrables',
    ar: 'التوصيل بين 1-3 أيام عمل'
  },
  fastDeliveryDetail: {
    en: 'Get your order in 1-3 business days.',
    fr: 'Recevez votre commande en 1-3 jours ouvrables.',
    ar: 'احصل على طلبك في غضون 1-3 أيام عمل.'
  },
  easyReturns: {
    en: 'Easy Returns',
    fr: 'Retours Faciles',
    ar: 'إرجاع سهل'
  },
  easyReturnsDesc: {
    en: 'Full refund if you\'re not satisfied with your purchase',
    fr: 'Remboursement intégral si vous n\'êtes pas satisfait de votre achat',
    ar: 'استرداد كامل إذا لم تكن راضيًا عن شرائك'
  },
  easyReturnsDetail: {
    en: 'Not satisfied? Get a full refund within 14 days.',
    fr: 'Pas satisfait? Obtenez un remboursement complet dans les 14 jours.',
    ar: 'غير راض؟ احصل على استرداد كامل في غضون 14 يومًا.'
  },
  limitedOffers: {
    en: 'Limited-time offers - act fast before they\'re gone!',
    fr: 'Offres à durée limitée - agissez vite avant qu\'elles ne disparaissent!',
    ar: 'عروض لفترة محدودة - تصرف بسرعة قبل نفادها!'
  },
  limitedTime: {
    en: 'Limited Time',
    fr: 'Temps Limité',
    ar: 'وقت محدود'
  },
  shopNow: {
    en: 'Shop Now',
    fr: 'Acheter Maintenant',
    ar: 'تسوق الآن'
  },
  secureCheckout: {
    en: 'Secure Checkout',
    fr: 'Paiement Sécurisé',
    ar: 'دفع آمن'
  },
  secureCheckoutDetail: {
    en: 'Your personal data is safe with our secure checkout.',
    fr: 'Vos données personnelles sont en sécurité avec notre paiement sécurisé.',
    ar: 'بياناتك الشخصية آمنة مع نظام الدفع الآمن لدينا.'
  },
  shippingAndReturns: {
    en: 'Shipping & Returns Policy',
    fr: 'Politique d\'Expédition et de Retour',
    ar: 'سياسة الشحن والإرجاع'
  },
  deliveryTime: {
    en: 'Delivery in 1-3 business days',
    fr: 'Livraison en 1-3 jours ouvrables',
    ar: 'التسليم في غضون 1-3 أيام عمل'
  }
};

// Create the context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with browser language or default to English
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('ma7alkom-language');
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
  
  // Handle language change
  const updateLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('ma7alkom-language', newLanguage);
  };
  
  // Update document direction and save language to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('ma7alkom-language', language);
  }, [language, direction]);
  
  // Translation function with parameter support
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let translation = translations;
    
    // Try to get nested translation
    for (let i = 0; i < keys.length - 1; i++) {
      if (translation[keys[i]]) {
        translation = translation[keys[i]] as unknown as Translations;
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
