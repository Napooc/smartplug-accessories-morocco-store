
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { ExternalLink, Users, Award, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const { t, direction } = useLanguage();
  
  return (
    <Layout>
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4" dir={direction}>
          <h1 className="text-3xl font-bold">{t('about')}</h1>
          <div className="flex items-center text-sm mt-2">
            <Link to="/" className="text-gray-500 hover:text-smartplug-blue">{t('home')}</Link>
            <span className="mx-2">/</span>
            <span className="font-medium">{t('about')}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12" dir={direction}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className={direction === 'rtl' ? 'lg:order-2' : 'lg:order-1'}>
            <h2 className="text-3xl font-bold mb-6">{t('storyTitle', { default: 'The Story Behind Ma7alkom' })}</h2>
            <p className="text-gray-600 mb-4">
              {t('storyParagraph1', { default: 'Founded in 2018, Ma7alkom began with a simple mission: to provide high-quality accessories at affordable prices to customers across Morocco.' })}
            </p>
            <p className="text-gray-600 mb-4">
              {t('storyParagraph2', { default: 'What started as a small shop in Berrechide has grown into one of Morocco\'s leading providers of accessories, serving customers nationwide with premium products that enhance their lives.' })}
            </p>
            <p className="text-gray-600 mb-6">
              {t('storyParagraph3', { default: 'We believe that great accessories don\'t have to come with a high price tag. Our team works directly with manufacturers to bring you the best products at the best prices.' })}
            </p>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  <Users size={20} className="text-smartplug-blue" />
                </div>
                <div>
                  <div className="font-bold text-xl">10,000+</div>
                  <div className="text-sm text-gray-500">{t('happyCustomers', { default: 'Happy Customers' })}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 mr-3">
                  <Award size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-xl">5+</div>
                  <div className="text-sm text-gray-500">{t('yearsExperience', { default: 'Years Experience' })}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`rounded-lg overflow-hidden shadow-md ${direction === 'rtl' ? 'lg:order-1' : 'lg:order-2'}`}>
            <img
              src="https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=2070&auto=format&fit=crop"
              alt={t('teamMa7alkom', { default: 'Team Ma7alkom' })}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">{t('ourValues', { default: 'Our Values' })}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('valuesIntro', { default: 'At Ma7alkom, we\'re guided by a set of core values that inform everything we do, from product selection to customer service.' })}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="p-3 bg-blue-100 rounded-full w-fit mb-4">
              <Award className="h-6 w-6 text-smartplug-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('qualityFirst', { default: 'Quality First' })}</h3>
            <p className="text-gray-600">
              {t('qualityDesc', { default: 'We rigorously test all products before adding them to our catalog to ensure they meet our high standards for durability and performance.' })}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="p-3 bg-purple-100 rounded-full w-fit mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('customerSatisfaction', { default: 'Customer Satisfaction' })}</h3>
            <p className="text-gray-600">
              {t('customerSatisfactionDesc', { default: 'Our customers are at the heart of everything we do. We\'re committed to providing exceptional service and support at every step.' })}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="p-3 bg-green-100 rounded-full w-fit mb-4">
              <ExternalLink className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('innovation', { default: 'Innovation' })}</h3>
            <p className="text-gray-600">
              {t('innovationDesc', { default: 'We constantly seek out the latest and most innovative products to keep our catalog fresh and exciting for our customers.' })}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-100 p-8 rounded-lg mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className={direction === 'rtl' ? 'lg:order-2' : 'lg:order-1'}>
              <h2 className="text-2xl font-bold mb-4">{t('visitStore', { default: 'Visit Our Store' })}</h2>
              <p className="text-gray-600 mb-6">
                {t('visitStoreDesc', { default: 'Experience our products in person at our flagship store in Berrechide. Our knowledgeable team is ready to help you find the perfect accessories for your device.' })}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-smartplug-blue mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">{t('location', { default: 'Location' })}</h4>
                    <p className="text-gray-600">Baydi 2, Berrechide, Morocco</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-smartplug-blue mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">{t('storeHours', { default: 'Store Hours' })}</h4>
                    <p className="text-gray-600">{t('storeHoursDetails', { default: 'Monday - Saturday: 08:00 AM - 6:00 PM' })}</p>
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
                title={t('storeLocation', { default: 'Ma7alkom Store Location' })}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
