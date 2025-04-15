
import React, { useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import StoreGallery from '@/components/About/StoreGallery';
import { ExternalLink, Users, Award, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';
import { LocalizedLink } from '@/components/ui/localized-link';
import { updatePageMetadata, updatePageLinks } from '@/lib/languageUtils';

const AboutPage = () => {
  const { t, direction, language } = useLanguage();
  
  // Update page title, meta description, and links
  useEffect(() => {
    // Update metadata
    updatePageMetadata(language, 'about', {
      seoTitles: { about: t('seoTitles.about') },
      seoDescriptions: { about: t('seoDescriptions.about') }
    });
    
    // Update links on the page
    updatePageLinks(language);
    
    // Add event listener for dynamic content
    const observer = new MutationObserver(() => {
      updatePageLinks(language);
    });
    
    // Start observing
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Clean up
    return () => observer.disconnect();
  }, [t, language]);
  
  return (
    <Layout>
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4" dir={direction}>
          <h1 className="text-3xl font-bold">{t('about')}</h1>
          <div className="flex items-center text-sm mt-2">
            <LocalizedLink to="/" className="text-gray-500 hover:text-smartplug-blue">{t('home')}</LocalizedLink>
            <span className="mx-2">/</span>
            <span className="font-medium">{t('about')}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12" dir={direction}>
        <div className="mb-16">
          <div className={direction === 'rtl' ? 'lg:order-2' : 'lg:order-1'}>
            <h2 className="text-3xl font-bold mb-6 text-center">{t('storyTitle')}</h2>
            <p className="text-gray-600 mb-4 max-w-3xl mx-auto text-center">
              {t('storyParagraph1')}
            </p>
            <p className="text-gray-600 mb-4 max-w-3xl mx-auto text-center">
              {t('storyParagraph2')}
            </p>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto text-center">
              {t('storyParagraph3')}
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center mb-10">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  <Users size={20} className="text-smartplug-blue" />
                </div>
                <div>
                  <div className="font-bold text-xl">10,000+</div>
                  <div className="text-sm text-gray-500">{t('happyCustomers')}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 mr-3">
                  <Award size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-xl">5+</div>
                  <div className="text-sm text-gray-500">{t('yearsExperience')}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Replace the static image with our interactive gallery */}
          <StoreGallery />
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">{t('ourValues')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('valuesIntro')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="p-3 bg-blue-100 rounded-full w-fit mb-4">
              <Award className="h-6 w-6 text-smartplug-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('qualityFirst')}</h3>
            <p className="text-gray-600">
              {t('qualityDesc')}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="p-3 bg-purple-100 rounded-full w-fit mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('customerSatisfaction')}</h3>
            <p className="text-gray-600">
              {t('customerSatisfactionDesc')}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="p-3 bg-green-100 rounded-full w-fit mb-4">
              <ExternalLink className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('innovation')}</h3>
            <p className="text-gray-600">
              {t('innovationDesc')}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-100 p-8 rounded-lg mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className={direction === 'rtl' ? 'lg:order-2' : 'lg:order-1'}>
              <h2 className="text-2xl font-bold mb-4">{t('visitStore')}</h2>
              <p className="text-gray-600 mb-6">
                {t('visitStoreDesc')}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-smartplug-blue mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">{t('location')}</h4>
                    <p className="text-gray-600">{t('storeAddress')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-smartplug-blue mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">{t('storeHours')}</h4>
                    <p className="text-gray-600">{t('storeHoursDetails')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`h-64 rounded-lg overflow-hidden ${direction === 'rtl' ? 'lg:order-1' : 'lg:order-2'}`}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53293.37174122122!2d-7.615080599999999!3d33.26849850000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda63da2dad8d647%3A0x892df6a8fb41e76!2sBerrechid%2C%20Morocco!5e0!3m2!1sen!2sus!4v1716489638211!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t('storeLocation')}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
