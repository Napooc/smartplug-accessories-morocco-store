
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Rating } from '@/components/Products/Rating';
import { ShoppingCart, ChevronRight, Heart } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, addToCart } = useStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const product = getProductById(id || '');
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the product you were looking for.
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center bg-smartplug-blue hover:bg-smartplug-lightblue text-white font-medium py-3 px-8 rounded-md transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  return (
    <Layout>
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-smartplug-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="text-gray-500 hover:text-smartplug-blue">Shop</Link>
            <span className="mx-2">/</span>
            <span className="font-medium">{product.name}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <img 
              src={product.images[selectedImage]} 
              alt={product.name} 
              className="w-full h-96 object-contain rounded-lg border" 
            />
            
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  className={`w-full h-24 object-cover rounded-md border cursor-pointer ${selectedImage === index ? 'border-smartplug-blue' : 'border-gray-300'}`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <Rating value={product.rating} />
              <span className="text-gray-500 ml-2">({product.rating})</span>
            </div>
            
            <div className="mb-4">
              <span className="text-2xl font-bold text-smartplug-blue">{product.price} DH</span>
              {product.oldPrice && (
                <span className="text-gray-500 line-through ml-2">{product.oldPrice} DH</span>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="flex items-center space-x-4 mb-6">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="absolute left-0 bottom-0 py-2 px-3 border-r border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    className="block w-24 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-smartplug-blue focus:border-smartplug-blue sm:text-sm"
                    placeholder="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="absolute right-0 bottom-0 py-2 px-3 border-l border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-200 focus:outline-none"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <Button 
                className="bg-smartplug-blue hover:bg-smartplug-lightblue flex items-center"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={16} className="mr-2" />
                Add to Cart
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-smartplug-blue">
                <Heart size={16} className="mr-2" />
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Related Products</h2>
          <p>Coming Soon...</p>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
