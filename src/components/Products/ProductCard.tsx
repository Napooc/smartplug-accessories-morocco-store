
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Rating } from './Rating';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();
  
  return (
    <div className="product-card">
      {product.onSale && (
        <span className="sale-badge absolute top-2 right-2">Sale</span>
      )}
      
      <Link to={`/product/${product.id}`}>
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="product-card-image"
        />
      </Link>
      
      <div className="product-card-content">
        <div className="product-rating">
          <Rating value={product.rating} />
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-lg mb-1 hover:text-smartplug-blue transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          <span className="product-price">{product.price} DH</span>
          {product.oldPrice && (
            <span className="product-old-price">{product.oldPrice} DH</span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            onClick={() => addToCart(product)}
            className="button-primary flex items-center"
          >
            <ShoppingCart size={16} className="mr-1" />
            Add to Cart
          </button>
          
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <Heart size={16} />
            </button>
            <Link to={`/product/${product.id}`} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <Eye size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
