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

const categoryBackgrounds: Record<string, string> = {
  'home-kitchen': 'url("https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&auto=format&fit=crop&q=80")',
  'electronics': 'url("https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=80")',
  'tools-lighting': 'url("https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=80")',
  'plumbing': 'url("https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500&auto=format&fit=crop&q=80")',
  'garden-terrace': 'url("https://images.unsplash.com/photo-1558904541-efa5a24e6850?w=500&auto=format&fit=crop&q=80")',
  'paint-hardware': 'url("https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop&q=80")',
  'bathroom-toilet': 'url("https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&auto=format&fit=crop&q=80")',
  'heating-ac': 'url("https://images.unsplash.com/photo-1581076827786-8e43ae8f3P0?w=500&auto=format&fit=crop&q=80")',
  'discounts-deals': 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)'
};

export default function CategoryGrid() {
  const { t, direction } = useLanguage();
  
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
              className="group relative overflow-hidden rounded-lg"
            >
              <div 
                className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"
                style={{
                  backgroundImage: categoryBackgrounds[category.id],
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="relative z-10 flex flex-col items-center p-6 h-full">
                <div className={`mb-4 p-3 rounded-full bg-white/90 backdrop-blur-sm transition-transform group-hover:scale-110 ${category.id === 'discounts-deals' ? 'bg-red-50' : ''}`}>
                  {categoryIcons[category.id]}
                </div>
                <h3 className={`text-center font-medium text-white text-shadow-sm ${category.id === 'discounts-deals' ? 'text-red-100' : ''}`}>
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
