
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import ProductGrid from '@/components/Products/ProductGrid';
import { useStore } from '@/lib/store';
import { categories } from '@/lib/data';
import { 
  Home, 
  Headphones,
  Wrench, 
  Droplet,
  Flower,
  PaintBucket,
  Bath,
  Thermometer,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';

// Map category IDs to their respective icons
const categoryIcons: Record<string, JSX.Element> = {
  'home-kitchen': <Home className="h-6 w-6" />,
  'electronics': <Headphones className="h-6 w-6" />,
  'tools-lighting': <Wrench className="h-6 w-6" />,
  'plumbing': <Droplet className="h-6 w-6" />,
  'garden-terrace': <Flower className="h-6 w-6" />,
  'paint-hardware': <PaintBucket className="h-6 w-6" />,
  'bathroom-toilet': <Bath className="h-6 w-6" />,
  'heating-ac': <Thermometer className="h-6 w-6" />
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getProductsByCategory } = useStore();
  const { t } = useLanguage();
  
  const category = categories.find((c) => c.id === categoryId);
  const products = getProductsByCategory(categoryId || '');
  
  return (
    <Layout>
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Link to="/shop" className="flex items-center text-smartplug-blue hover:text-smartplug-lightblue transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="text-sm">{t('backToShop')}</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-full shadow-sm">
              {categoryIcons[categoryId || ''] || <Home className="h-8 w-8" />}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 capitalize">{category?.name || t('category')}</h1>
              <div className="flex items-center text-sm mt-2 text-gray-600">
                <Link to="/" className="hover:text-smartplug-blue">{t('home')}</Link>
                <span className="mx-2">/</span>
                <Link to="/shop" className="hover:text-smartplug-blue">{t('shop')}</Link>
                <span className="mx-2">/</span>
                <span className="font-medium text-gray-800 capitalize">{category?.name || categoryId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-10">
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">{t('noProductsFound')}</h2>
            <p className="text-gray-600 mb-6">
              {t('noProductsInCategory')}
            </p>
            <Link 
              to="/shop" 
              className="inline-block bg-smartplug-blue hover:bg-smartplug-lightblue text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              {t('backToShop')}
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-gray-600">
                {t('showingProducts', { count: products.length, category: category?.name || t('thisCategory') })}
              </p>
            </div>
            <ProductGrid products={products} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
