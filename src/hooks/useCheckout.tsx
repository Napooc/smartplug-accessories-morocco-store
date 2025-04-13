
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { CustomerInfo } from '@/lib/types';

type OrderResult = {
  success: boolean;
  orderId?: string;
  orderTotal?: number;
  orderDate?: string;
  error?: string;
};

export function useCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart, cartTotal, clearCart } = useStore();
  const { placeOrderSecure } = useOrderService();
  
  const processOrder = async (customerData: CustomerInfo): Promise<OrderResult> => {
    if (isProcessing) {
      return { success: false, error: 'An order is already being processed' };
    }
    
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty' };
    }
    
    try {
      setIsProcessing(true);
      console.log('Processing order with customer data:', customerData);
      
      // Validate customer data
      if (!validateCustomerData(customerData)) {
        setIsProcessing(false);
        return { success: false, error: 'Invalid customer information' };
      }
      
      // Place the order
      const orderResult = await placeOrderSecure(customerData);
      
      if (orderResult) {
        // Order placed successfully
        clearCart();
        return {
          success: true,
          orderId: orderResult.id,
          orderTotal: orderResult.total,
          orderDate: orderResult.date
        };
      } else {
        return { success: false, error: 'Failed to place order' };
      }
    } catch (error) {
      console.error('Error in processOrder:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Validate customer data
  const validateCustomerData = (data: CustomerInfo): boolean => {
    return Boolean(
      data && 
      data.name && 
      data.name.length >= 2 && 
      data.phone && 
      data.phone.length >= 8 && 
      data.city && 
      data.city.length >= 1
    );
  };
  
  return {
    isProcessing,
    processOrder
  };
}

// Separate service for handling order placement
function useOrderService() {
  const { cart, cartTotal, setCustomerInfo, placeOrder } = useStore();
  
  const placeOrderSecure = async (customerData: CustomerInfo) => {
    if (!customerData || !customerData.name || !customerData.phone || !customerData.city) {
      console.error('Invalid customer data:', customerData);
      throw new Error('Complete customer information is required');
    }
    
    console.log('Setting customer info:', customerData);
    
    // First set customer info (synchronous)
    setCustomerInfo(customerData);
    
    // Ensure all required fields are serializable for Supabase
    const processedCustomerData = JSON.parse(JSON.stringify(customerData));
    
    // Verify customer info was set properly
    console.log('Customer info set, now placing order');
    
    try {
      // Place the order (async)
      return await placeOrder();
    } catch (error) {
      console.error('Error in placeOrderSecure:', error);
      throw error;
    }
  };
  
  return {
    placeOrderSecure
  };
}
