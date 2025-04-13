
import Layout from '@/components/Layout/Layout';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const ContactPage = () => {
  const { t, direction } = useLanguage();
  useScrollToTop();
  
  return (
    <Layout>
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{t('contact')}</h1>
          <div className="flex items-center text-sm mt-2">
            <a href="/" className="text-gray-500 hover:text-smartplug-blue">{t('home')}</a>
            <span className="mx-2">/</span>
            <span className="font-medium">{t('contact')}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16" dir={direction}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('getInTouch')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('contactIntro')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-8 rounded-lg shadow-md border text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Phone className="h-7 w-7 text-smartplug-blue" />
              </div>
              <h3 className="font-medium text-xl mb-3">{t('phoneTitle')}</h3>
              <p className="text-gray-600">+212-691-772215</p>
              <a 
                href="tel:+212691772215" 
                className="mt-4 inline-block text-smartplug-blue hover:underline"
              >
                {t('callNow', { default: 'Call now' })}
              </a>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md border text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Mail className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-medium text-xl mb-3">{t('emailTitle')}</h3>
              <p className="text-gray-600">Bouzraranwar@gmail.com</p>
              <a 
                href="mailto:Bouzraranwar@gmail.com" 
                className="mt-4 inline-block text-green-600 hover:underline"
              >
                {t('sendEmail', { default: 'Send email' })}
              </a>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md border text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <MapPin className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="font-medium text-xl mb-3">{t('addressTitle')}</h3>
              <p className="text-gray-600">Baydi 2</p>
              <p className="text-gray-600">Berrechide, Morocco</p>
              <a 
                href="https://maps.google.com/?q=Baydi+2,Berrechide,Morocco" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-block text-purple-600 hover:underline"
              >
                {t('viewMap', { default: 'View on map' })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
