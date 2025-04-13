
import ProductCard from './ProductCard';
import { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
  title?: string;
  highlight?: boolean; // Added highlight prop for special styling
}

const ProductGrid = ({ products, title, highlight = false }: ProductGridProps) => {
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className={highlight ? "bg-red-50 py-8 rounded-lg" : ""}>
      {title && (
        <h2 className={`text-2xl font-bold mb-6 ${highlight ? "text-red-600 px-4" : ""}`}>
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
