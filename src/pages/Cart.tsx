
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/languageContext';

const Cart = () => {
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal } = useStore();
  const { t } = useLanguage();
  
  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">{t('yourCart')}</h2>
          <p className="text-gray-600 mb-8">
            {t('noItemsAdded')}
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center bg-smartplug-blue hover:bg-smartplug-lightblue text-white font-medium py-3 px-8 rounded-md transition-colors"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{t('shoppingCart')}</h1>
          <div className="flex items-center text-sm mt-2">
            <Link to="/" className="text-gray-500 hover:text-smartplug-blue">{t('home')}</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="text-gray-500 hover:text-smartplug-blue">{t('shop')}</Link>
            <span className="mx-2">/</span>
            <span className="font-medium">{t('cart')}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="py-4 px-6">{t('product')}</th>
                    <th className="py-4 px-6">{t('price')}</th>
                    <th className="py-4 px-6">{t('quantity')}</th>
                    <th className="py-4 px-6">{t('total')}</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cart.map((item) => (
                    <tr key={item.product.id}>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 object-contain rounded border p-1 mr-4"
                          />
                          <Link to={`/product/${item.product.id}`} className="font-medium hover:text-smartplug-blue">
                            {item.product.name}
                          </Link>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {item.product.price} DH
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center border rounded-md max-w-[120px]">
                          <button
                            onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 border-r hover:bg-gray-100 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-4 py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1 border-l hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium">
                        {(item.product.price * item.quantity).toFixed(2)} DH
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex space-x-2 mb-4 sm:mb-0">
                <Input 
                  placeholder={t('discountCode')} 
                  className="w-48"
                />
                <Button variant="outline">{t('applyDiscount')}</Button>
              </div>
              
              <Link to="/shop">
                <Button variant="outline" className="flex items-center">
                  <ArrowRight size={16} className="mr-2 rotate-180" />
                  {t('continueShopping')}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Cart summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-bold mb-4">{t('cartSummary')}</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('subtotal')}</span>
                  <span className="font-medium">{cartTotal.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('shipping')}</span>
                  <span className="font-medium">{t('free')}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between">
                  <span className="font-bold">{t('total')}</span>
                  <span className="font-bold text-xl text-smartplug-blue">
                    {cartTotal.toFixed(2)} DH
                  </span>
                </div>
              </div>
              
              <Link to="/checkout">
                <Button className="w-full bg-smartplug-blue hover:bg-smartplug-lightblue">
                  {t('proceedToCheckout')}
                </Button>
              </Link>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">{t('weAccept')}</h3>
                <div className="flex items-center space-x-2">
                  <div className="p-2 border rounded">
                    {t('cashOnDelivery')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
