
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/languageContext';
import { useCheckout } from '@/hooks/useCheckout';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cities } from '@/lib/data';

const CheckoutForm = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { processOrder, isProcessing } = useCheckout();
  
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
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Form submitted with values:', values);
      
      const result = await processOrder({
        name: values.name,
        phone: values.phone,
        city: values.city,
        country: 'Morocco',
        // Split name into first and last name
        firstName: values.name.split(' ')[0] || '',
        lastName: values.name.split(' ').slice(1).join(' ') || '',
        // Default values to prevent null/undefined issues
        email: 'customer@example.com',
        address: `${values.city}, Morocco`,
        postalCode: '00000'
      });
      
      if (result.success) {
        toast.success(t('orderSuccessful', { default: 'Order placed successfully!' }));
        navigate('/confirmation', { 
          state: { 
            orderId: result.orderId, 
            orderTotal: result.orderTotal,
            orderDate: result.orderDate
          } 
        });
      } else {
        toast.error(result.error || t('orderFailed', { default: 'Failed to place order' }));
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error(t('orderFailed', { default: 'Failed to place order' }));
    }
  };
  
  return (
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
              className="w-full bg-smartplug-blue hover:bg-smartplug-lightblue flex items-center justify-center gap-2" 
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('processing')}
                </>
              ) : (
                t('placeOrder')
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutForm;
