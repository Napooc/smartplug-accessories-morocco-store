
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Rating } from './Rating';

interface ProductCardProps {
  product: Product;
}

// Helper to get a unique product image based on product name/id
const getUniqueProductImage = (productId: string, productName: string): string => {
  // If the product already has real images, use the first one
  if (productId.startsWith('prod-') && !productId.includes('1')) {
    // These are newly added products with real images
    return ''; // Will use the product's actual image
  }
  
  // For demo products, generate unique images based on name
  const nameHash = productName.toLowerCase().replace(/\s/g, '');
  
  const uniqueImages = {
    // Smart speakers
    'smartspeaker': 'https://images.unsplash.com/photo-1544428571-c3ea505baa38?w=500&auto=format&fit=crop&q=80',
    'voiceassistant': 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&auto=format&fit=crop&q=80',
    'speaker': 'https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?w=500&auto=format&fit=crop&q=80',
    
    // Headphones
    'headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    'earbuds': 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop&q=80',
    'gaming': 'https://images.unsplash.com/photo-1612444530582-fc66183b16f8?w=500&auto=format&fit=crop&q=80',
    
    // Smartwatches
    'smartwatch': 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=500&auto=format&fit=crop&q=80',
    'watch': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=80',
    'fitness': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=80',
    
    // Cameras
    'camera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    'security': 'https://images.unsplash.com/photo-1582931423747-f7207cab14e5?w=500&auto=format&fit=crop&q=80',
    
    // Other gadgets
    'charger': 'https://images.unsplash.com/photo-1618842602192-2f9c0d57666f?w=500&auto=format&fit=crop&q=80',
    'powerbank': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format&fit=crop&q=80',
    'phone': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80',
    'adapter': 'https://images.unsplash.com/photo-1662994581277-ba58862b43d2?w=500&auto=format&fit=crop&q=80',
    'hub': 'https://images.unsplash.com/photo-1649859394614-dc4646ad634c?w=500&auto=format&fit=crop&q=80',
    'plug': 'https://images.unsplash.com/photo-1587212193650-ff26ea75bc92?w=500&auto=format&fit=crop&q=80',
    'usb': 'https://images.unsplash.com/photo-1611754349119-0a60420137a4?w=500&auto=format&fit=crop&q=80',
    'cable': 'https://images.unsplash.com/photo-1611754349119-0a60420137a4?w=500&auto=format&fit=crop&q=80',
    'wireless': 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&auto=format&fit=crop&q=80',
  };
  
  // Find the matching key in the uniqueImages object
  const matchingKey = Object.keys(uniqueImages).find(key => 
    nameHash.includes(key) || productName.toLowerCase().includes(key)
  );
  
  // If we found a matching image, use it
  if (matchingKey) {
    return uniqueImages[matchingKey as keyof typeof uniqueImages];
  }
  
  // Fallback to a default image based on product ID
  const fallbackImages = Object.values(uniqueImages);
  const index = parseInt(productId.replace(/\D/g, '')) % fallbackImages.length;
  return fallbackImages[index];
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();
  
  // Get product image - either use the custom one or the first from the product
  const productImage = getUniqueProductImage(product.id, product.name) || product.images[0];
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col h-full">
      {product.onSale && (
        <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold absolute top-2 right-2 rounded">
          Sale
        </span>
      )}
      
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden h-48">
        <img 
          src={productImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-2">
          <Rating value={product.rating} />
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-lg mb-1 hover:text-smartplug-blue transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          <span className="text-lg font-bold text-smartplug-blue">{product.price} DH</span>
          {product.oldPrice && (
            <span className="text-gray-400 text-sm line-through ml-2">{product.oldPrice} DH</span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            onClick={() => addToCart(product)}
            className="bg-smartplug-blue hover:bg-smartplug-lightblue text-white px-3 py-1.5 rounded text-sm flex items-center transition-colors"
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
