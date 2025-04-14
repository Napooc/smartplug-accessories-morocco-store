
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import ProductGrid from '@/components/Products/ProductGrid';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, addToCart, products } = useStore();
  const [quantity, setQuantity] = useState(1);
  
  const product = getProductById(id || '');
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Link to="/shop" className="text-smartplug-blue hover:underline mt-4 inline-block">
            Return to shop
          </Link>
        </div>
      </Layout>
    );
  }
  
  // Get related products (same category, exclude current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  // Get product image - use the first image if available or find a suitable placeholder
  let productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80`;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-smartplug-blue">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to="/shop" className="text-gray-500 hover:text-smartplug-blue">Shop</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to={`/categories/${product.category}`} className="text-gray-500 hover:text-smartplug-blue capitalize">
            {product.category}
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>
        
        {/* Product details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product image */}
          <div className="bg-white rounded-lg p-4 border">
            <img 
              src={productImage} 
              alt={product.name} 
              className="w-full h-auto object-contain"
              style={{ maxHeight: '400px' }}
              loading="eager"
            />
          </div>
          
          {/* Product info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-smartplug-blue">{product.price} DH</span>
              {product.oldPrice && (
                <span className="line-through text-gray-500 ml-2">{product.oldPrice} DH</span>
              )}
              
              {product.onSale && (
                <span className="sale-badge ml-4">Sale</span>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Stock status */}
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {product.stock > 0 
                    ? `In Stock (${product.stock} available)` 
                    : "Out of Stock"}
                </span>
              </div>
              <div className="ml-6 text-sm text-gray-600">
                SKU: <span className="font-medium">{product.sku}</span>
              </div>
            </div>
            
            {/* Quantity selector */}
            <div className="flex items-center mb-6">
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={decreaseQuantity}
                  className="px-4 py-2 border-r hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="px-4 py-2 border-l hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              
              <Button 
                onClick={handleAddToCart}
                className="ml-4 flex items-center bg-smartplug-blue hover:bg-smartplug-lightblue"
              >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </Button>
            </div>
            
            <hr className="my-6" />
            
            {/* Category */}
            <div className="text-gray-600">
              <span className="font-medium">Category:</span>{" "}
              <Link to={`/categories/${product.category}`} className="hover:text-smartplug-blue capitalize">
                {product.category}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Product tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full border-b border-gray-200">
              <TabsTrigger value="description">Description</TabsTrigger>
            </TabsList>
            <div className="p-4 border rounded-b-lg bg-white">
              <TabsContent value="description">
                <h3 className="text-lg font-medium mb-2">Product Description</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.
                </p>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <ProductGrid products={relatedProducts} title="Related Products" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
