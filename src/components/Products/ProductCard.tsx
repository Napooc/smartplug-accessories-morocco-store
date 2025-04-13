
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Rating } from './Rating';
import { useLanguage } from '@/lib/languageContext';

interface ProductCardProps {
  product: Product;
}

// Helper to get a unique product image based on product name/id
const getUniqueProductImage = (productId: string, productName: string): string => {
  // If the product already has real images, use the first one
  if (product => product.images && product.images.length > 0) {
    return product.images[0];
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
    
    // Tech accessories
    'charger': 'https://images.unsplash.com/photo-1618842602192-2f9c0d57666f?w=500&auto=format&fit=crop&q=80',
    'powerbank': 'https://images.unsplash.com/photo-1609091839311-d5365f8ff1c5?w=500&auto=format&fit=crop&q=80',
    'phone': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80',
    'adapter': 'https://images.unsplash.com/photo-1662994581277-ba58862b43d2?w=500&auto=format&fit=crop&q=80',
    'hub': 'https://images.unsplash.com/photo-1649859394614-dc4646ad634c?w=500&auto=format&fit=crop&q=80',
    'plug': 'https://images.unsplash.com/photo-1587212193650-ff26ea75bc92?w=500&auto=format&fit=crop&q=80',
    'usb': 'https://images.unsplash.com/photo-1611754349119-0a60420137a4?w=500&auto=format&fit=crop&q=80',
    'cable': 'https://images.unsplash.com/photo-1611754349119-0a60420137a4?w=500&auto=format&fit=crop&q=80',
    'wireless': 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&auto=format&fit=crop&q=80',
    
    // Kitchen accessories
    'kitchen': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&auto=format&fit=crop&q=80',
    'appliance': 'https://images.unsplash.com/photo-1585659722983-3a681b8a6b3d?w=500&auto=format&fit=crop&q=80',
    'blender': 'https://images.unsplash.com/photo-1597226401851-87e8c91248de?w=500&auto=format&fit=crop&q=80',
    'mixer': 'https://images.unsplash.com/photo-1594282486552-05a3b6fbff97?w=500&auto=format&fit=crop&q=80',
    'cooker': 'https://images.unsplash.com/photo-1596886251705-2826ffa70eb0?w=500&auto=format&fit=crop&q=80',
    
    // Furniture
    'chair': 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=500&auto=format&fit=crop&q=80',
    'table': 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500&auto=format&fit=crop&q=80',
    'sofa': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&auto=format&fit=crop&q=80',
    'furniture': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&auto=format&fit=crop&q=80',
    'desk': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=80',
    'outdoor': 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=500&auto=format&fit=crop&q=80',
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
  const { t, direction } = useLanguage();
  
  // Get product image - use default image or match based on name
  let productImage = "";
  
  // First check if the product has actual images
  if (product.images && product.images.length > 0) {
    productImage = product.images[0];
  } 
  
  // If no actual images, use the unique image generator
  if (!productImage) {
    productImage = getUniqueProductImage(product.id, product.name);
  }
  
  // Function to get translated product name and description
  // For a real app, we would have translation keys for each product
  // Here we're using the product data directly, but in a real implementation
  // you would likely have translation keys for each product
  const getTranslatedProductData = (field: 'name' | 'description') => {
    // In a real app, you would fetch translations for each product
    // For now, we'll just return the original text
    return product[field];
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col h-full" dir={direction}>
      {product.onSale && (
        <span className="bg-smartplug-blue text-white px-2 py-1 text-xs font-bold absolute top-2 right-2 rounded">
          {t('sale')}
        </span>
      )}
      
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden h-48">
        <img 
          src={productImage} 
          alt={getTranslatedProductData('name')}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="eager"
        />
      </Link>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-2">
          <Rating value={product.rating} />
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-lg mb-1 hover:text-smartplug-blue transition-colors">
            {getTranslatedProductData('name')}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
          {getTranslatedProductData('description')}
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
            {t('addToCart')}
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
