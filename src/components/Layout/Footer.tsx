
import { Link } from 'react-router-dom';
import { Headphones, Phone, Mail, Tag } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white pt-12 mt-16 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Headphones className="h-6 w-6 text-smartplug-blue" />
              <span className="text-xl font-bold text-gray-900">Ma7alkom</span>
            </div>
            <p className="text-gray-600">
              {t('footerDescription')}
            </p>
            <div className="flex items-center space-x-2">
              <Phone size={16} className="text-gray-600" />
              <span className="text-gray-600">+212-691-772215</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={16} className="text-gray-600" />
              <span className="text-gray-600">Bouzraranwar@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag size={16} className="text-red-500" />
              <Link to="/categories/discounts-deals" className="text-red-500 hover:text-red-600">
                {t('discountsDeals', { default: 'Discounts & Deals' })}
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('usefulLinks')}</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-smartplug-blue">{t('home')}</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-smartplug-blue">{t('about')}</Link></li>
              <li><Link to="/shop" className="text-gray-600 hover:text-smartplug-blue">{t('shop')}</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-smartplug-blue">{t('contact')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-smartplug-blue">{t('about')}</Link></li>
              <li><Link to="/shop" className="text-gray-600 hover:text-smartplug-blue">{t('shop')}</Link></li>
              <div className="flex items-center space-x-2">
                <Headphones className="h-4 w-4 text-smartplug-blue" />
                <Link to="/contact" className="text-gray-600 hover:text-smartplug-blue">{t('contact')}</Link>
              </div>
            </ul>
            <div className="mt-4">
              <h4 className="font-medium mb-2">{t('address', { default: 'Address' })}</h4>
              <p className="text-gray-600">Baydi 2, Berrechide, Morocco</p>
              <p className="text-gray-600">{t('storeHours', { default: 'Store Hours' })}: Monday - Saturday: 08:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">© {currentYear} Ma7alkom. {t('allRightsReserved')}</p>
            <p className="text-gray-600 mt-2 md:mt-0">
              <Link to="/privacy" className="hover:text-smartplug-blue">{t('privacyPolicy')}</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
