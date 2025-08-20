
import ProductCard from './ProductCard';
import { Product } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';
import { ProductGridSkeleton } from '@/components/ui/product-skeleton';

interface ProductGridProps {
  products: Product[];
  title?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function ProductGrid({ 
  products, 
  title, 
  emptyMessage, 
  isLoading = false,
  showLoadMore = false,
  onLoadMore,
  hasMore = false
}: ProductGridProps) {
  const { t, direction } = useLanguage();
  
  return (
    <div className="py-6 md:py-8" dir={direction}>
      {title && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2">
          <h2 className="text-xl md:text-2xl font-bold">{t(title.toLowerCase().replace(/\s/g, ''), { default: title })}</h2>
          <a href="/shop" className="text-smartplug-blue hover:underline text-sm md:text-base">{t('viewAll')}</a>
        </div>
      )}
      
      {isLoading && products.length === 0 ? (
        <ProductGridSkeleton count={8} />
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {showLoadMore && hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={onLoadMore}
                disabled={isLoading}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Load More Products'}
              </button>
            </div>
          )}
          
          {isLoading && products.length > 0 && (
            <div className="mt-6">
              <ProductGridSkeleton count={4} />
            </div>
          )}
        </>
      ) : (
        emptyMessage && <p className="text-center text-gray-500 py-6 md:py-8">{emptyMessage}</p>
      )}
    </div>
  );
}
