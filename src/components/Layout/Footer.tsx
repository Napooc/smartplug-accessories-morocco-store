
import { Link } from 'react-router-dom';
import { Headphones, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/languageContext';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white pt-12 mt-16 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <span className="text-gray-600">+212-555-1234</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={16} className="text-gray-600" />
              <span className="text-gray-600">contact@ma7alkom.com</span>
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
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('newsletter')}</h3>
            <p className="text-gray-600 mb-4">{t('newsletterText')}</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder={t('enterEmail')} className="bg-gray-100" />
              <Button>{t('subscribe')}</Button>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-600 hover:text-smartplug-blue">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-smartplug-blue">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-smartplug-blue">
                <Twitter size={20} />
              </a>
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
