import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cities } from '@/lib/data';
import { toast } from 'sonner';
import { CustomerInfo, Order } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';
import { Truck, Clock, RotateCcw, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, setCustomerInfo, placeOrder } = useStore();
  const { t, language, direction } = useLanguage();
  
  const [formData, setFormData] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Casablanca',
    country: 'Morocco',
    postalCode: '',
    name: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, city: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.city) {
      toast.error(t('nameRequired'));
      return;
    }
    
    if (cart.length === 0) {
      toast.error(t('emptyCart'));
      return;
    }
    
    try {
      if (isLoading) return;
      
      setIsLoading(true);
      
      setCustomerInfo(formData);
      
      console.log('Placing order with customer info:', formData);
      console.log('Cart contents:', cart);
      
      const orderResult = await Promise.race([
        placeOrder(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Order request timed out')), 15000)
        )
      ]);
      
      console.log('Order result:', orderResult);
      
      if (orderResult && typeof orderResult === 'object' && 'id' in orderResult) {
        navigate('/confirmation', { 
          state: { 
            orderId: orderResult.id, 
            orderTotal: orderResult.total 
          } 
        });
        toast.success(t('orderPlaced'));
      } else {
        throw new Error('Failed to place order: empty response');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      
      const errorMessage = error instanceof Error 
        ? `${t('orderFailed')}: ${error.message}` 
        : t('orderFailed');
        
      toast.error(errorMessage);
      
      setIsLoading(false);
    }
  };
  
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
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">{t('shippingInfo')}</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      {t('fullName')}*
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('fullName')}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="nickname" className="block text-sm font-medium mb-1">
                      {t('nickname')}
                    </label>
                    <Input
                      id="nickname"
                      name="nickname"
                      value={formData.nickname || ''}
                      onChange={handleInputChange}
                      placeholder={t('enterNickname')}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      {t('phone')}*
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t('phone')}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">
                      {t('city')}*
                    </label>
                    <Select 
                      value={formData.city} 
                      onValueChange={handleCityChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`${t('city')}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? t('processing') : t('placeOrder')}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            
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
              
              <div className="mt-4 pt-4 border-t">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? t('processing') : t('placeOrder')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
