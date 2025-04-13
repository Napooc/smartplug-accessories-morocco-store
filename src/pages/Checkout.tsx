
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/languageContext';
import { Button } from '@/components/ui/button';
import { Truck, Clock, RotateCcw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import CheckoutForm from '@/components/Checkout/CheckoutForm';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal } = useStore();
  const { t, direction } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  
  // Verify cart is not empty and redirect if it is
  useEffect(() => {
    const checkCart = () => {
      setIsLoading(false);
      if (cart.length === 0) {
        toast.error(t('emptyCart', { default: 'Your cart is empty' }));
        navigate('/shop');
        return false;
      }
      return true;
    };
    
    // Short timeout to ensure store is loaded
    const timer = setTimeout(checkCart, 300);
    return () => clearTimeout(timer);
  }, [cart, navigate, t]);
  
  // Show loading state while checking cart
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-smartplug-blue"></div>
        </div>
      </Layout>
    );
  }
  
  // Show empty cart message if cart is empty
  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <h1 className="text-2xl font-bold mb-6">{t('cart')}</h1>
          <div className="text-center py-8">
            <p className="mb-4">{t('emptyCart')}</p>
            <Button onClick={() => navigate('/shop')}>{t('shop')}</Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-10" dir={direction}>
        <h1 className="text-2xl font-bold mb-6">{t('checkout')}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {/* Checkout form */}
            <CheckoutForm />
            
            <div className="mt-6 bg-gray-50 p-6 rounded-lg border">
              <h3 className="font-medium mb-4 text-gray-800">{t('shippingAndReturns', { default: 'Shipping & Returns Policy' })}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start p-3 bg-white rounded-lg border">
                  <Truck className="w-8 h-8 text-smartplug-blue mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('freeShipping', { default: 'Free Shipping' })}</h4>
                    <p className="text-gray-500 text-sm">
                      {t('freeShippingDetail', { default: 'We offer free shipping on all orders throughout Morocco.' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-white rounded-lg border">
                  <Clock className="w-8 h-8 text-green-600 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('fastDelivery', { default: 'Fast Delivery' })}</h4>
                    <p className="text-gray-500 text-sm">
                      {t('fastDeliveryDetail', { default: 'Get your order in 1-3 business days.' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-white rounded-lg border">
                  <RotateCcw className="w-8 h-8 text-orange-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('easyReturns', { default: 'Easy Returns' })}</h4>
                    <p className="text-gray-500 text-sm">
                      {t('easyReturnsDetail', { default: 'Not satisfied? Get a full refund within 14 days.' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-white rounded-lg border">
                  <ShieldCheck className="w-8 h-8 text-purple-600 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('secureCheckout', { default: 'Secure Checkout' })}</h4>
                    <p className="text-gray-500 text-sm">
                      {t('secureCheckoutDetail', { default: 'Your personal data is safe with our secure checkout.' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
              <h2 className="text-xl font-semibold mb-4">{t('orderSummary')}</h2>
              
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3 flex">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-gray-500 text-sm">{t('quantity')}: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {(item.product.price * item.quantity).toFixed(2)} DH
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="py-3 flex font-bold">
                  <div className="flex-1">{t('total')}</div>
                  <div>{cartTotal.toFixed(2)} DH</div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>* {t('cashOnDelivery')}</p>
                <p>* {t('free')} {t('shipping')}</p>
                <p>* {t('deliveryTime', { default: 'Delivery in 1-3 business days' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
