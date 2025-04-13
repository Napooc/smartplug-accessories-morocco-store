
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag, Clock, Package, AlertTriangle } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/languageContext';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, direction } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get order details from location state
  const orderData = location.state || {};
  const { orderId, orderTotal, orderDate } = orderData;

  useEffect(() => {
    // If no order details are present, redirect to home after showing a message
    if (!orderId) {
      toast.error(t('noOrderFound', { default: 'No order details found' }));
      // Short delay to allow the toast to be seen
      const timer = setTimeout(() => {
        navigate('/');
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [orderId, navigate, t]);

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-smartplug-blue"></div>
        </div>
      </Layout>
    );
  }
  
  // If redirecting, don't render the rest
  if (!orderId) {
    return null;
  }
  
  // Format the order date
  const formattedDate = orderDate || new Date().toISOString().split('T')[0];
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16" dir={direction}>
        <div className="max-w-md mx-auto bg-white shadow-sm border rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{t('thankYou')}</h1>
            <p className="text-gray-600">
              {t('orderPlaced')}
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Order details card */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Package size={18} className="text-smartplug-blue" />
                <h3 className="font-semibold">{t('orderDetails')}</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('orderId')}:</span>
                  <span className="font-medium">{orderId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('total')}:</span>
                  <span className="font-medium">{orderTotal?.toFixed(2)} DH</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('date')}:</span>
                  <span className="font-medium">{formattedDate}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('paymentMethod')}:</span>
                  <span className="font-medium">{t('cashOnDelivery')}</span>
                </div>
              </div>
            </div>
            
            {/* Delivery information */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={18} className="text-orange-500" />
                <h3 className="font-semibold">{t('deliveryInformation', { default: 'Delivery Information' })}</h3>
              </div>
              
              <p className="text-sm text-gray-600">
                {t('deliveryTimeInfo', { default: 'Your order will be delivered within 1-3 business days. We will contact you before delivery.' })}
              </p>
            </div>
            
            {/* Payment instructions */}
            <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-blue-600" />
                <h3 className="font-semibold">{t('paymentInstructions', { default: 'Payment Instructions' })}</h3>
              </div>
              
              <p className="text-sm text-gray-700">
                {t('paymentInstructionsDetails', { default: 'Please prepare the exact amount for payment upon delivery. Our delivery person will provide a receipt.' })}
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link to="/" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Home size={18} />
                  {t('backToHomepage')}
                </Button>
              </Link>
              
              <Link to="/shop" className="flex-1">
                <Button 
                  className="w-full bg-smartplug-blue hover:bg-smartplug-lightblue flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  {t('continueShopping')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
