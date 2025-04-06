
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cities } from '@/lib/data';
import { toast } from 'sonner';
import { CustomerInfo } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, setCustomerInfo, placeOrder } = useStore();
  const { t, language, direction } = useLanguage();
  
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    phone: '',
    city: 'Casablanca',
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
      setIsLoading(true);
      setCustomerInfo(formData);
      
      // Place order and wait for the result
      const orderResult = await placeOrder();
      
      if (orderResult && orderResult.id) {
        navigate('/confirmation', { 
          state: { 
            orderId: orderResult.id, 
            orderTotal: orderResult.total 
          } 
        });
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error(t('orderFailed'));
    } finally {
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
        <h1 className="text-2xl font-bold mb-6">{t('cart')}</h1>
        
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
