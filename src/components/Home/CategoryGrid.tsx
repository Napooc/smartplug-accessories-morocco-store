
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

// Map category IDs to background images
const categoryBackgrounds: Record<string, string> = {
  'home-kitchen': 'url("/lovable-uploads/510962dd-e810-4cd9-9b41-1e0a46b8d38c.png")',
  'electronics': 'url("/lovable-uploads/563a1834-b7fa-40eb-8a01-96162ae40d11.png")',
  'tools-lighting': 'url("/lovable-uploads/630c44e5-1c0c-4664-8ac2-18390ad254fb.png")',
  'plumbing': 'url("/lovable-uploads/6bfd59e2-26e4-406d-9e31-d41eb1f05a9e.png")',
  'garden-terrace': 'url("/lovable-uploads/bab8df4b-bc99-4788-b6d6-9d1fc02f7989.png")',
  'paint-hardware': 'url("/lovable-uploads/cef5ff18-965d-4340-b406-174f5540da6e.png")',
  'bathroom-toilet': 'url("/lovable-uploads/e93b813d-dd74-40cc-a282-dc0a2ee841e8.png")',
  'heating-ac': 'url("/lovable-uploads/eadfa6b1-267d-4782-914f-c0c339dba27d.png")',
  'discounts-deals': 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)'
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

  const allCategories = [...categories, 
    {id: 'discounts-deals', name: 'Discounts & Deals'}
  ].filter((cat, index, self) => 
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
              className="group relative overflow-hidden"
            >
              <div 
                className={`flex flex-col items-center p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full transform hover:-translate-y-1 relative z-10 bg-white/90 backdrop-blur-sm ${category.id === 'discounts-deals' ? 'border-red-100' : ''}`}
                style={{
                  backgroundImage: categoryBackgrounds[category.id],
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
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
