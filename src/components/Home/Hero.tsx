
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1500&auto=format&fit=crop&q=80',
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
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1500&auto=format&fit=crop&q=80',
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
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1500&auto=format&fit=crop&q=80',
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
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-background">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            currentSlide === index 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          {/* Modern gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
          
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title[language]}
            className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
          />
          
          {/* Content Container */}
          <div className="container mx-auto px-4 h-full flex items-center relative z-20">
            <div className="max-w-2xl">
              {/* Modern content card */}
              <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl">
                <div className="space-y-6">
                  {/* Badge */}
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
                    <span className="text-sm font-medium text-white">Premium Quality</span>
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      {slide.title[language]}
                    </span>
                  </h1>
                  
                  {/* Subtitle */}
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-md">
                    {slide.subtitle[language]}
                  </p>
                  
                  {/* Price with modern styling */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {slide.price}
                    </span>
                    <div className="h-8 w-px bg-white/30"></div>
                    <span className="text-white/70 text-sm">Starting from</span>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="pt-4">
                    <Link
                      to={slide.link}
                      className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
                    >
                      <span>{slide.cta[language]}</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl z-5"></div>
          <div className="absolute bottom-32 left-20 w-24 h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-2xl z-5"></div>
        </div>
      ))}
      
      {/* Modern Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full border border-white/20 transition-all duration-300 hover:scale-110 z-30 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full border border-white/20 transition-all duration-300 hover:scale-110 z-30 group"
      >
        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
      
      {/* Modern Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index 
                ? 'w-12 h-3 bg-gradient-to-r from-primary to-accent' 
                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            }`}
          ></button>
        ))}
      </div>
      
      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20"></div>
    </div>
  );
}
