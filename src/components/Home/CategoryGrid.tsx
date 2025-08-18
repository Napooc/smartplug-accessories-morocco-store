
import { Link } from 'react-router-dom';
import { 
  Percent, 
  Wrench,
  Droplet,
  Car,
  Package
} from 'lucide-react';
import { categories } from '@/lib/data';
import { useLanguage } from '@/lib/languageContext';

const categoryIcons: Record<string, JSX.Element> = {
  'remises-offres': <Percent className="h-6 w-6 text-red-500" />,
  'scotch': <Package className="h-6 w-6 text-blue-500" />,
  'droguerie': <Wrench className="h-6 w-6 text-green-500" />,
  'sanitaire': <Droplet className="h-6 w-6 text-cyan-500" />,
  'automobile': <Car className="h-6 w-6 text-purple-500" />
};

const categoryBackgrounds: Record<string, string> = {
  'remises-offres': 'url("https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&auto=format&fit=crop&q=80")',
  'scotch': 'url("https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=500&auto=format&fit=crop&q=80")',
  'droguerie': 'url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=80")',
  'sanitaire': 'url("https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80")',
  'automobile': 'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=80")'
};

export default function CategoryGrid() {
  const { t, direction } = useLanguage();
  
  const categoryTranslationKeys: Record<string, string> = {
    'remises-offres': 'remisesOffres',
    'scotch': 'scotch',
    'droguerie': 'droguerie',
    'sanitaire': 'sanitaire',
    'automobile': 'automobile'
  };
  
  return (
    <section className="py-12 bg-gray-50" dir={direction}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('shopByCategory')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('shopByCategoryDesc')}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => (
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
              <div className="relative z-10 flex flex-col items-center p-6 h-32 justify-center">
                <div className="mb-3 p-3 rounded-full bg-white/90 backdrop-blur-sm transition-transform group-hover:scale-110">
                  {categoryIcons[category.id]}
                </div>
                <h3 className="text-center font-medium text-white text-shadow-sm text-sm">
                  {t(categoryTranslationKeys[category.id] || category.id)}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
