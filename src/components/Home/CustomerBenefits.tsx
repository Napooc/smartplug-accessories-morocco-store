
import { Truck, Headphones, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

const CustomerBenefits = () => {
  const { t, direction } = useLanguage();
  
  const benefits = [
    {
      icon: <Truck className="h-10 w-10 text-smartplug-blue" />,
      title: t('fastFreeShipping', { default: 'Fast & Free Shipping' }),
      description: t('shippingDesc', { default: 'To all Moroccan cities in 24-48 hours.' })
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-purple-600" />,
      title: t('tryBeforeYouPay', { default: 'Try Before You Pay' }),
      description: t('tryDesc', { default: 'Try them, pay only if you are satisfied.' })
    },
    {
      icon: <Headphones className="h-10 w-10 text-green-600" />,
      title: t('customerSupport', { default: 'Customer Support' }),
      description: t('supportDesc', { default: 'Available to answer all your questions.' })
    }
  ];
  
  return (
    <section className="py-10" dir={direction}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-full bg-gray-50 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerBenefits;
