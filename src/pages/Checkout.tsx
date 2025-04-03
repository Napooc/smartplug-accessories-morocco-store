import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { useStore } from '@/lib/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cities } from '@/lib/data';
import { CustomerInfo } from '@/lib/types';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, customerInfo, setCustomerInfo, placeOrder } = useStore();
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  
  const [formData, setFormData] = useState<CustomerInfo>({
    name: customerInfo?.name || '',
    nickname: customerInfo?.nickname || '',
    phone: customerInfo?.phone || '',
    city: customerInfo?.city || '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (errors[name as keyof CustomerInfo]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };
  
  const handleCityChange = (value: string) => {
    setFormData({
      ...formData,
      city: value,
    });
    
    if (errors.city) {
      setErrors({
        ...errors,
        city: undefined,
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Partial<CustomerInfo> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^0[567]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Moroccan phone number';
    }
    
    if (!formData.city) {
      newErrors.city = 'Please select a city';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    
    setCustomerInfo(formData);
    
    const orderResult = placeOrder();
    
    if (orderResult) {
      navigate('/confirmation', { state: { orderId: orderResult.id } });
    }
  };
  
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }
  
  return (
    <Layout>
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="flex items-center text-sm mt-2">
            <a href="/" className="text-gray-500 hover:text-smartplug-blue">Home</a>
            <span className="mx-2">/</span>
            <a href="/cart" className="text-gray-500 hover:text-smartplug-blue">Cart</a>
            <span className="mx-2">/</span>
            <span className="font-medium">Checkout</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>
                  Please fill in your details for delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nickname">
                        Nickname (Optional)
                      </Label>
                      <Input
                        id="nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? 'border-red-500' : ''}
                        placeholder="e.g., 0612345678"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.city}
                        onValueChange={handleCityChange}
                      >
                        <SelectTrigger
                          id="city"
                          className={errors.city ? 'border-red-500' : ''}
                        >
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.id} value={city.name}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.city && (
                        <p className="text-red-500 text-sm">{errors.city}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payment">Payment Method</Label>
                    <div className="p-4 border rounded-md bg-gray-50 flex items-center gap-3">
                      <div>
                        <input
                          type="radio"
                          id="cod"
                          name="payment"
                          checked
                          className="rounded-full"
                          readOnly
                        />
                      </div>
                      <div>
                        <label htmlFor="cod" className="font-medium">Cash on Delivery</label>
                        <p className="text-gray-600 text-sm">Pay when you receive your products</p>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.product.name}</span>
                      <span className="text-sm text-gray-600 block">
                        {item.quantity} x {item.product.price} DH
                      </span>
                    </div>
                    <span className="font-medium">
                      {(item.product.price * item.quantity).toFixed(2)} DH
                    </span>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{cartTotal.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-smartplug-blue">{cartTotal.toFixed(2)} DH</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-smartplug-blue hover:bg-smartplug-lightblue"
                  onClick={handleSubmit}
                >
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
