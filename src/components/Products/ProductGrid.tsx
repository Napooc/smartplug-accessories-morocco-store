
import ProductCard from './ProductCard';
import { Product } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export default function ProductGrid({ products, title }: ProductGridProps) {
  const { t } = useLanguage();
  
  return (
    <div className="py-8">
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t(title.toLowerCase().replace(/\s/g, ''), { default: title })}</h2>
          <a href="/shop" className="text-smartplug-blue hover:underline">{t('viewAll', { default: 'View All' })}</a>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
