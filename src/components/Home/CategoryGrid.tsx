
import { Link } from 'react-router-dom';
import { 
  Home, 
  Headphones,
  Wrench, 
  Droplet,
  Flower,
  PaintBucket,
  Bath,
  Thermometer
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
  'heating-ac': <Thermometer className="h-6 w-6 text-smartplug-blue" />
};

export default function CategoryGrid() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('shopByCategory')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('shopByCategoryDesc')}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/categories/${category.id}`}
              className="group"
            >
              <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full transform hover:-translate-y-1">
                <div className="mb-4 p-3 bg-gray-50 rounded-full group-hover:bg-smartplug-blue/10 transition-colors">
                  {categoryIcons[category.id]}
                </div>
                <h3 className="text-center font-medium text-gray-800 group-hover:text-smartplug-blue transition-colors">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
