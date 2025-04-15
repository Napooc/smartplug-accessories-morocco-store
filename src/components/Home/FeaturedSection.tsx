
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';

interface FeaturedSectionProps {
  title: string;
  subtitle?: string;
  categoryName: string;
  bgColor?: string;
  textColor?: string;
  imageUrl: string;
  link: string;
}

export default function FeaturedSection({
  title,
  subtitle,
  categoryName,
  bgColor = 'bg-gray-100',
  textColor = 'text-gray-900',
  imageUrl,
  link
}: FeaturedSectionProps) {
  const { t, direction } = useLanguage();
  
  return (
    <div className={`${bgColor} ${textColor} rounded-lg overflow-hidden`}>
      <div className="container mx-auto p-8 flex flex-col md:flex-row items-center justify-between" dir={direction}>
        <div className={`md:w-1/2 mb-6 md:mb-0 ${direction === 'rtl' ? 'md:order-2' : 'md:order-1'}`}>
          <h3 className="text-lg font-medium mb-1">{t('featured')} {t(`categories.${categoryName}`, { default: categoryName })}</h3>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-lg mb-6">{subtitle}</p>}
          <Link 
            to={link}
            className="inline-block bg-smartplug-blue hover:bg-smartplug-lightblue text-white font-medium py-3 px-8 rounded-md transition-colors"
          >
            {t('viewAllProducts')}
          </Link>
        </div>
        <div className={`md:w-1/2 flex justify-center ${direction === 'rtl' ? 'md:order-1' : 'md:order-2'}`}>
          <img 
            src={imageUrl} 
            alt={title} 
            className="max-h-[300px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
