import { useState, useEffect } from 'react';
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
import { Truck, Clock, RotateCcw, ShieldCheck } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, setCustomerInfo, placeOrder, clearCart } = useStore();
  const { t, direction } = useLanguage();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Create a schema for form validation
  const formSchema = z.object({
    name: z.string().min(2, { message: t('nameRequired', { default: 'Name is required' }) }),
    phone: z.string().min(8, { message: t('phoneRequired', { default: 'Valid phone number is required' }) }),
    city: z.string().min(1, { message: t('cityRequired', { default: 'City is required' }) }),
  });
  
  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      city: 'Casablanca'
    }
  });
  
  // Empty cart redirect
  useEffect(() => {
    if (cart.length === 0) {
      toast.error(t('emptyCart', { default: 'Your cart is empty' }));
      navigate('/shop');
    }
  }, [cart, navigate, t]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (cart.length === 0) {
      toast.error(t('emptyCart', { default: 'Your cart is empty' }));
      navigate('/shop');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create a complete customer info object with all required fields
      const customerInfo: CustomerInfo = {
        name: values.name,
        phone: values.phone,
        city: values.city,
        country: 'Morocco',
        firstName: values.name.split(' ')[0] || '',
        lastName: values.name.split(' ').slice(1).join(' ') || '',
        email: 'customer@example.com', // Default email to prevent null values
        address: `${values.city}, Morocco`, // Default address using city
        postalCode: '00000' // Default postal code
      };
      
      console.log('Setting customer info before order placement:', customerInfo);
      
      // First set the customer info - this operation is synchronous
      setCustomerInfo(customerInfo);
      
      // NOW place the order - making sure we have all required fields already set
      try {
        console.log('Attempting to place order with valid customer info');
        const orderResult = await placeOrder();
        
        console.log('Order result received:', orderResult);
        
        if (!orderResult || !orderResult.id) {
          throw new Error('Order creation failed');
        }
        
        // Clear cart after successful order placement
        clearCart();
        
        // Navigate to confirmation page with order details
        navigate('/confirmation', { 
          state: { 
            orderId: orderResult.id, 
            orderTotal: orderResult.total,
            orderDate: orderResult.date
          } 
        });
        
        toast.success(t('orderSuccessful', { default: 'Order placed successfully!' }));
      } catch (error) {
        console.error('Error during order placement:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : t('orderFailed', { default: 'Failed to place order' });
        toast.error(errorMessage);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during checkout form processing:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : t('orderFailed', { default: 'Failed to process checkout form' });
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
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('fullName')}*</FormLabel>
                        <FormControl>
                          <Input placeholder={t('fullName')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('phone')}*</FormLabel>
                        <FormControl>
                          <Input placeholder={t('phone')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('city')}*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('city')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={city.name}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-smartplug-blue hover:bg-smartplug-lightblue" 
                      disabled={isLoading}
                    >
                      {isLoading ? t('processing') : t('placeOrder')}
                    </Button>
                  </div>
                </form>
              </Form>
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
                  className="w-full bg-smartplug-blue hover:bg-smartplug-lightblue" 
                  disabled={isLoading}
                  onClick={form.handleSubmit(onSubmit)}
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
