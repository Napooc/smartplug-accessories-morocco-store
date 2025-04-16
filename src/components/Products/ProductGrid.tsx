
import ProductCard from './ProductCard';
import { Product } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';

interface ProductGridProps {
  products: Product[];
  title?: string;
  emptyMessage?: string;
}

export default function ProductGrid({ products, title, emptyMessage }: ProductGridProps) {
  const { t, direction } = useLanguage();
  
  // Debugging log to verify the products being rendered
  console.log(`Rendering ProductGrid with title "${title}" and ${products.length} products:`, 
    products.map(p => ({ id: p.id, name: p.name, placement: p.placement })));
  
  return (
    <div className="py-8" dir={direction}>
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t(title.toLowerCase().replace(/\s/g, ''), { default: title })}</h2>
          <a href="/shop" className="text-smartplug-blue hover:underline">{t('viewAll')}</a>
        </div>
      )}
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        emptyMessage && <p className="text-center text-gray-500 py-8">{emptyMessage}</p>
      )}
    </div>
  );
}
