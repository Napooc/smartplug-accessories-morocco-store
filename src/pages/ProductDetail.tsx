import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import ProductGrid from '@/components/Products/ProductGrid';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/lib/languageContext';
import { ColorVariant } from '@/lib/types';
import { LocalizedLink } from '@/components/ui/localized-link';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, addToCart, products } = useStore();
  const { t, direction } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const product = getProductById(id || '');
  
  // Get color variant from URL param
  const colorParam = searchParams.get('color');
  const [selectedColorVariant, setSelectedColorVariant] = useState<ColorVariant | undefined>(
    product?.colorVariants?.find(c => c.id === colorParam)
  );
  
  // Update selected color when URL param changes or product loads
  useEffect(() => {
    if (product?.colorVariants?.length) {
      // Try to get variant from URL param
      const variantFromParam = product.colorVariants.find(c => c.id === colorParam);
      
      // If URL param is valid, use it, otherwise use first variant
      setSelectedColorVariant(variantFromParam || product.colorVariants[0]);
    }
  }, [product, colorParam]);
  
  // Set URL when selected color changes
  useEffect(() => {
    if (selectedColorVariant && selectedColorVariant.id !== colorParam) {
      searchParams.set('color', selectedColorVariant.id);
      setSearchParams(searchParams);
    }
  }, [selectedColorVariant]);
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold">{t('productNotFound', { default: 'Product not found' })}</h2>
          <LocalizedLink to="/shop" className="text-smartplug-blue hover:underline mt-4 inline-block">
            {t('returnToShop', { default: 'Return to shop' })}
          </LocalizedLink>
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
    const maxStock = selectedColorVariant 
      ? selectedColorVariant.stock 
      : product.stock;
      
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(product);
  };
  
  // Get the current price accounting for color variants
  const getCurrentPrice = () => {
    if (selectedColorVariant) {
      return product.price + selectedColorVariant.priceAdjustment;
    }
    return product.price;
  };
  
  // Get the current old price accounting for color variants
  const getCurrentOldPrice = () => {
    if (selectedColorVariant && product.oldPrice) {
      return product.oldPrice + selectedColorVariant.priceAdjustment;
    }
    return product.oldPrice;
  };
  
  // Get current stock level
  const getCurrentStock = () => {
    return selectedColorVariant ? selectedColorVariant.stock : product.stock;
  };
  
  // Get product images - use color variant images if selected
  const getProductImages = () => {
    if (selectedColorVariant && selectedColorVariant.images.length > 0) {
      return selectedColorVariant.images;
    }
    return product.images;
  };
  
  // Get main product image
  const productImage = getProductImages()[0] || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80`;
  
  // Handle color selection
  const handleColorSelect = (colorVariant: ColorVariant) => {
    setSelectedColorVariant(colorVariant);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8" dir={direction}>
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <LocalizedLink to="/" className="text-gray-500 hover:text-smartplug-blue">{t('home')}</LocalizedLink>
          <span className="mx-2 text-gray-500">/</span>
          <LocalizedLink to="/shop" className="text-gray-500 hover:text-smartplug-blue">{t('shop')}</LocalizedLink>
          <span className="mx-2 text-gray-500">/</span>
          <LocalizedLink to={`/categories/${product.category}`} className="text-gray-500 hover:text-smartplug-blue capitalize">
            {t(`categories.${product.category}`, { default: product.category })}
          </LocalizedLink>
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
            
            {/* Color variant image gallery */}
            {getProductImages().length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {getProductImages().map((img, index) => (
                  <div 
                    key={index} 
                    className="border rounded cursor-pointer hover:border-smartplug-blue"
                    onClick={() => {
                      // In a more complex implementation, this would switch the main image
                      // without changing the variant
                    }}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} ${index+1}`} 
                      className="h-16 w-16 object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-smartplug-blue">{getCurrentPrice()} DH</span>
              {getCurrentOldPrice() && (
                <span className="line-through text-gray-500 ml-2">{getCurrentOldPrice()} DH</span>
              )}
              
              {product.onSale && (
                <span className="sale-badge ml-4">{t('sale')}</span>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Color variants */}
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">{t('selectColor', { default: 'Select Color' })}</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colorVariants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => handleColorSelect(variant)}
                      className={`
                        w-10 h-10 rounded-full border-2 flex items-center justify-center
                        ${selectedColorVariant?.id === variant.id ? 'border-smartplug-blue' : 'border-gray-200'}
                      `}
                      style={{ backgroundColor: variant.hexValue }}
                      title={variant.name}
                      aria-label={`Select color ${variant.name}`}
                    >
                      {selectedColorVariant?.id === variant.id && (
                        <div className="w-4 h-4 rounded-full border-2 border-white" />
                      )}
                    </button>
                  ))}
                </div>
                {selectedColorVariant && (
                  <p className="text-sm mt-2">
                    {selectedColorVariant.name}
                    {selectedColorVariant.priceAdjustment > 0 && ` (+${selectedColorVariant.priceAdjustment} DH)`}
                  </p>
                )}
              </div>
            )}
            
            {/* Stock status */}
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {getCurrentStock() > 0 
                    ? t('inStock', { count: getCurrentStock(), default: `In Stock (${getCurrentStock()} available)` })
                    : t('outOfStock', { default: "Out of Stock" })}
                </span>
              </div>
              <div className="ml-6 text-sm text-gray-600">
                {t('sku', { default: 'SKU' })}: <span className="font-medium">{product.sku}</span>
              </div>
            </div>
            
            {/* Quantity selector */}
            <div className="flex items-center mb-6">
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={decreaseQuantity}
                  className="px-4 py-2 border-r hover:bg-gray-100"
                  disabled={getCurrentStock() <= 0}
                >
                  -
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="px-4 py-2 border-l hover:bg-gray-100"
                  disabled={getCurrentStock() <= 0 || quantity >= getCurrentStock()}
                >
                  +
                </button>
              </div>
              
              <Button 
                onClick={handleAddToCart}
                className="ml-4 flex items-center bg-smartplug-blue hover:bg-smartplug-lightblue"
                disabled={getCurrentStock() <= 0}
              >
                <ShoppingCart size={18} className="mr-2" />
                {t('addToCart')}
              </Button>
            </div>
            
            <hr className="my-6" />
            
            {/* Category */}
            <div className="text-gray-600">
              <span className="font-medium">{t('category', { default: 'Category' })}:</span>{" "}
              <LocalizedLink to={`/categories/${product.category}`} className="hover:text-smartplug-blue capitalize">
                {t(`categories.${product.category}`, { default: product.category })}
              </LocalizedLink>
            </div>
          </div>
        </div>
        
        {/* Product tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full border-b border-gray-200">
              <TabsTrigger value="description">{t('description', { default: 'Description' })}</TabsTrigger>
            </TabsList>
            <div className="p-4 border rounded-b-lg bg-white">
              <TabsContent value="description">
                <h3 className="text-lg font-medium mb-2">{t('productDescription', { default: 'Product Description' })}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-gray-600">
                  {t('productExtendedDescription', { default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.'})}
                </p>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <ProductGrid products={relatedProducts} title={t('relatedProducts', { default: 'Related Products' })} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
