
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1655826630513-6a9ad02f8ad9?q=80&w=1200&auto=format&fit=crop',
    title: 'SmartPlug: Innovation Meets Excellence!',
    subtitle: 'Premium Phone Accessories',
    price: '199.00 DH',
    cta: 'Shop Products Now',
    link: '/shop'
  },
  {
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?q=80&w=1200&auto=format&fit=crop',
    title: 'Premium Headphones',
    subtitle: 'Experience Sound Like Never Before',
    price: '499.00 DH',
    cta: 'View Product',
    link: '/product/3'
  },
  {
    image: 'https://images.unsplash.com/photo-1587652880114-a47d4e48701f?q=80&w=1200&auto=format&fit=crop',
    title: 'Fast Charging',
    subtitle: 'Power Up Your Devices Quickly',
    price: '149.00 DH',
    cta: 'Shop Chargers',
    link: '/categories/chargers'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
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
    <div className="relative bg-black h-[500px] overflow-hidden">
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
            alt={slide.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="container mx-auto px-4 h-full flex items-center relative z-20">
            <div className="max-w-lg text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
              <p className="text-xl mb-2">{slide.subtitle}</p>
              <p className="text-2xl font-bold text-smartplug-blue mb-6">{slide.price}</p>
              <Link
                to={slide.link}
                className="inline-block bg-smartplug-blue hover:bg-smartplug-lightblue text-white font-medium py-3 px-8 rounded-md transition-colors"
              >
                {slide.cta}
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
