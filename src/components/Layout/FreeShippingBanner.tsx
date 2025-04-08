
import React, { useState } from 'react';
import { Truck, X } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

const FreeShippingBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useLanguage();
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-smartplug-blue text-white py-2 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <Truck className="h-4 w-4 mr-2 animate-bounce" />
          <p className="text-sm font-medium">
            {t('freeShipping')}
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 text-white hover:opacity-80"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeShippingBanner;
