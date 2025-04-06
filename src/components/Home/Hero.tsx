
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';

const slides = [
  {
    image: 'public/lovable-uploads/d43cee92-fe2b-4bf8-9f35-83c2b8988c7f.png',
    title: {
      en: 'SmartPlug: Phone Accessories',
      fr: 'SmartPlug: Accessoires pour Téléphone',
      ar: 'سمارت بلق: ملحقات الهاتف'
    },
    subtitle: {
      en: 'Premium Quality Products',
      fr: 'Produits de Qualité Premium',
      ar: 'منتجات ذات جودة عالية'
    },
    price: '199.00 DH',
    cta: {
      en: 'Shop Products Now',
      fr: 'Acheter Maintenant',
      ar: 'تسوق المنتجات الآن'
    },
    link: '/shop'
  },
  {
    image: 'public/lovable-uploads/8f83e58f-4fff-46a3-887d-a6d4e7a15f52.png',
    title: {
      en: 'Kitchen Accessories',
      fr: 'Accessoires de Cuisine',
      ar: 'مستلزمات المطبخ'
    },
    subtitle: {
      en: 'Experience Cooking Like Never Before',
      fr: 'Découvrez la Cuisine Comme Jamais Auparavant',
      ar: 'تجربة الطبخ كما لم يسبق لها مثيل'
    },
    price: '499.00 DH',
    cta: {
      en: 'View Products',
      fr: 'Voir les Produits',
      ar: 'عرض المنتجات'
    },
    link: '/product/3'
  },
  {
    image: 'public/lovable-uploads/0047597a-c6de-41a3-a1fd-f78d056c5147.png',
    title: {
      en: 'Outdoor Furniture',
      fr: 'Mobilier d\'Extérieur',
      ar: 'أثاث خارجي'
    },
    subtitle: {
      en: 'Relax in Style and Comfort',
      fr: 'Détendez-vous avec Style et Confort',
      ar: 'استرخ بأناقة وراحة'
    },
    price: '1499.00 DH',
    cta: {
      en: 'Shop Collection',
      fr: 'Voir la Collection',
      ar: 'تصفح المجموعة'
    },
    link: '/categories/furniture'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useLanguage();
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  // Auto slide
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative bg-black h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            currentSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
          <img
            src={slide.image}
            alt={slide.title[language]}
            className="w-full h-full object-cover object-center"
          />
          <div className="container mx-auto px-4 h-full flex items-center relative z-20">
            <div className="max-w-lg text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{slide.title[language]}</h1>
              <p className="text-xl mb-2">{slide.subtitle[language]}</p>
              <p className="text-2xl font-bold text-smartplug-blue mb-6">{slide.price}</p>
              <Link
                to={slide.link}
                className="inline-block bg-smartplug-blue hover:bg-smartplug-lightblue text-white font-medium py-3 px-8 rounded-md transition-colors"
              >
                {slide.cta[language]}
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-30"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-30"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-smartplug-blue' : 'bg-white/50'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
