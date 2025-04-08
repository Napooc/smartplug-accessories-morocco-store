
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '@/lib/languageContext';
import { Truck, Glasses, Headphones } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Service Features */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fast Shipping */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Truck className="h-8 w-8 text-smartplug-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{t('fastFreeShipping')}</h3>
                <p className="text-gray-600">{t('shippingDescription')}</p>
              </div>
            </div>
            
            {/* Try Before Pay */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Glasses className="h-8 w-8 text-smartplug-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{t('tryBeforePay')}</h3>
                <p className="text-gray-600">{t('tryBeforePayDesc')}</p>
              </div>
            </div>
            
            {/* Customer Support */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Headphones className="h-8 w-8 text-smartplug-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{t('customerSupport')}</h3>
                <p className="text-gray-600">{t('customerSupportDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
