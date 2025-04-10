
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};
  
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);
  
  if (!orderId) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-block p-3 bg-green-100 rounded-full mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-lg text-gray-600 mb-2">
            Your order has been placed successfully.
          </p>
          <p className="text-gray-600 mb-8">
            Order ID: <span className="font-medium">{orderId}</span>
          </p>
          
          <div className="bg-gray-50 border rounded-lg p-6 text-left mb-8">
            <h3 className="font-medium mb-4">Order Details</h3>
            <p className="text-sm text-gray-600 mb-2">
              Your order has been received and is now being processed. You will receive a confirmation call shortly.
            </p>
            <p className="text-sm text-gray-600">
              Payment method: <span className="font-medium">Cash on Delivery</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home size={18} />
                Back to Homepage
              </Button>
            </Link>
            
            <Link to="/shop">
              <Button className="bg-smartplug-blue hover:bg-smartplug-lightblue">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
