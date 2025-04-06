
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';

export default function Hero() {
  const { t, direction } = useLanguage();
  
  return (
    <div className="relative bg-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="flex flex-wrap h-full">
          <div className="w-1/3 h-full">
            <img 
              src="/lovable-uploads/961f39ea-a8f1-4c16-a353-7e3ddbdbebd6.png" 
              alt="Smartphone accessories" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/3 h-full">
            <img 
              src="/lovable-uploads/e5c23b1e-472f-436c-8e3f-3ce5bb588542.png" 
              alt="Kitchen accessories" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/3 h-full">
            <img 
              src="/lovable-uploads/844dba87-9e4e-485f-9370-a02ff88edc9a.png" 
              alt="Outdoor furniture" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-4 py-24 md:py-32 relative" dir={direction}>
        <div className="max-w-md">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('heroTitle') || 'Smart Accessories for Modern Life'}
          </h1>
          <p className="text-lg mb-8">
            {t('heroSubtitle') || 'Discover our collection of high-quality accessories for smartphones, home, and outdoors.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="bg-smartplug-blue hover:bg-smartplug-lightblue text-white font-medium rounded-md px-6 py-3 transition-colors"
            >
              {t('shop')}
            </Link>
            <Link
              to="/about"
              className="bg-white text-gray-900 hover:bg-gray-100 font-medium rounded-md px-6 py-3 transition-colors"
            >
              {t('about')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
