import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/languageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { moroccanCities } from '@/lib/data';

const Checkout = () => {
  const { cart, cartTotal, customerInfo, setCustomerInfo, placeOrder } = useStore();
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: customerInfo?.name || '',
    nickname: customerInfo?.nickname || '',
    phone: customerInfo?.phone || '',
    city: customerInfo?.city || ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    city: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      city: value
    }));
    
    if (errors.city) {
      setErrors(prev => ({
        ...prev,
        city: ''
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newErrors = {
      name: formData.name ? '' : t('nameRequired', { default: 'Full name is required' }),
      phone: formData.phone 
        ? (/^(\+\d{1,3})?\d{9,10}$/.test(formData.phone.trim()) 
            ? '' 
            : t('validPhone', { default: 'Please enter a valid phone number' }))
        : t('phoneRequired', { default: 'Phone number is required' }),
      city: formData.city ? '' : t('cityRequired', { default: 'Please select a city' })
    };
    
    setErrors(newErrors);
    
    if (newErrors.name || newErrors.phone || newErrors.city) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      setCustomerInfo(formData);
      
      const order = await placeOrder();
      
      if (order) {
        navigate(`/order-confirmation/${order.id}`);
      } else {
        toast.error(t('orderError', { default: 'Failed to place order. Please try again.' }));
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(t('orderError', { default: 'Failed to place order. Please try again.' }));
    } finally {
      setIsProcessing(false);
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
      <div className="container mx-auto px-4 py-8" dir={direction}>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{t('personalInfo', { default: 'Personal Information' })}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('fullName', { default: 'Full Name' })}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('yourName', { default: 'Your full name' })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nickname">{t('nickname', { default: 'Nickname (Optional)' })}</Label>
                  <Input
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    placeholder={t('yourNickname', { default: 'How you prefer to be called' })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phone', { default: 'Phone Number' })}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('yourPhone', { default: 'Your phone number' })}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">{t('city', { default: 'City' })}</Label>
                  <Select value={formData.city} onValueChange={handleSelectChange}>
                    <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('selectCity', { default: 'Select your city' })} />
                    </SelectTrigger>
                    <SelectContent>
                      {moroccanCities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {t(`cities.${city.id}`, { default: city.name })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full mt-6 bg-smartplug-blue hover:bg-smartplug-lightblue"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('processing', { default: 'Processing...' })}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        {t('placeOrder', { default: 'Place Order' })}
                      </span>
                    )}
                  </Button>
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
