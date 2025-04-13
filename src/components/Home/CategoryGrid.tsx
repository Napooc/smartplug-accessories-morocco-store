
import { Link } from 'react-router-dom';
import { 
  Home, 
  Headphones,
  Wrench, 
  Droplet,
  Flower,
  PaintBucket,
  Bath,
  Thermometer,
  Tag
} from 'lucide-react';
import { categories } from '@/lib/data';
import { useLanguage } from '@/lib/languageContext';

// Map category IDs to their respective icons
const categoryIcons: Record<string, JSX.Element> = {
  'home-kitchen': <Home className="h-6 w-6 text-smartplug-blue" />,
  'electronics': <Headphones className="h-6 w-6 text-smartplug-blue" />,
  'tools-lighting': <Wrench className="h-6 w-6 text-smartplug-blue" />,
  'plumbing': <Droplet className="h-6 w-6 text-smartplug-blue" />,
  'garden-terrace': <Flower className="h-6 w-6 text-smartplug-blue" />,
  'paint-hardware': <PaintBucket className="h-6 w-6 text-smartplug-blue" />,
  'bathroom-toilet': <Bath className="h-6 w-6 text-smartplug-blue" />,
  'heating-ac': <Thermometer className="h-6 w-6 text-smartplug-blue" />,
  'discounts-deals': <Tag className="h-6 w-6 text-red-500" />
};

export default function CategoryGrid() {
  const { t, direction } = useLanguage();
  
  // Map of category IDs to translation keys
  const categoryTranslationKeys: Record<string, string> = {
    'home-kitchen': 'homeKitchen',
    'electronics': 'electronics',
    'tools-lighting': 'toolsLighting',
    'plumbing': 'plumbing',
    'garden-terrace': 'gardenTerrace',
    'paint-hardware': 'paintHardware',
    'bathroom-toilet': 'bathroomToilet',
    'heating-ac': 'heatingAc',
    'discounts-deals': 'discountsDeals'
  };

  // Customize the additional discounts category that might not be in the data
  const allCategories = [...categories, 
    {id: 'discounts-deals', name: 'Discounts & Deals'}
  ].filter((cat, index, self) => 
    // Remove duplicates if the category already exists in data
    index === self.findIndex((c) => c.id === cat.id)
  );
  
  return (
    <section className="py-12 bg-gray-50" dir={direction}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('shopByCategory')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('shopByCategoryDesc')}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {allCategories.map((category) => (
            <Link 
              key={category.id}
              to={`/categories/${category.id}`}
              className="group"
            >
              <div className={`flex flex-col items-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full transform hover:-translate-y-1 ${category.id === 'discounts-deals' ? 'border-red-100' : ''}`}>
                <div className={`mb-4 p-3 rounded-full transition-colors ${category.id === 'discounts-deals' ? 'bg-red-50 group-hover:bg-red-100' : 'bg-gray-50 group-hover:bg-smartplug-blue/10'}`}>
                  {categoryIcons[category.id]}
                </div>
                <h3 className={`text-center font-medium transition-colors ${category.id === 'discounts-deals' ? 'text-red-600 group-hover:text-red-700' : 'text-gray-800 group-hover:text-smartplug-blue'}`}>
                  {t(categoryTranslationKeys[category.id] || category.id, { default: category.name })}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
