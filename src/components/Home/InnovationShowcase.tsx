
import { Link } from 'react-router-dom';
import { Tag, Zap, TruckFast, RotateCcw, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

export default function InnovationShowcase() {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 rounded-lg overflow-hidden bg-gradient-to-r from-orange-500 to-red-500">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center bg-white/20 text-white px-4 py-2 rounded-full mb-4">
              <Tag className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{t('specialOffers')}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('exclusiveDiscounts')}</h2>
            
            <p className="text-white/90 text-lg mb-6 max-w-xl mx-auto lg:mx-0">
              {t('discountDesc', { default: 'Limited time deals on our best products. Save up to 30% on selected items across our entire catalog.' })}
            </p>
            
            <ul className="space-y-3 mb-8 text-left max-w-md mx-auto lg:mx-0">
              <li className="flex items-start text-white/90">
                <TruckFast className="h-5 w-5 text-white mr-2 mt-0.5 bg-white/30 rounded-full p-1 flex-shrink-0" />
                <span>{t('freeShipping', { default: 'Free shipping on all orders above 300 DH' })}</span>
              </li>
              <li className="flex items-start text-white/90">
                <Clock className="h-5 w-5 text-white mr-2 mt-0.5 bg-white/30 rounded-full p-1 flex-shrink-0" />
                <span>{t('fastDelivery', { default: 'Fast delivery within 1-3 business days' })}</span>
              </li>
              <li className="flex items-start text-white/90">
                <RotateCcw className="h-5 w-5 text-white mr-2 mt-0.5 bg-white/30 rounded-full p-1 flex-shrink-0" />
                <span>{t('easyRefund', { default: 'Easy refunds if you\'re not satisfied with your purchase' })}</span>
              </li>
              <li className="flex items-start text-white/90">
                <Zap className="h-5 w-5 text-white mr-2 mt-0.5 bg-white/30 rounded-full p-1 flex-shrink-0" />
                <span>{t('limitedOffers', { default: 'Limited-time offers - act fast before they\'re gone!' })}</span>
              </li>
            </ul>
            
            <Link 
              to="/shop"
              className="inline-block bg-white hover:bg-gray-100 text-orange-600 font-medium py-3 px-8 rounded-md transition-colors"
            >
              {t('shopNow')}
            </Link>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt={t('exclusiveDiscounts')} 
                className="max-w-full rounded-lg shadow-lg max-h-[400px] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-orange-600 font-bold text-lg">-30%</p>
                <p className="text-gray-600 text-sm">{t('limitedTime')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
