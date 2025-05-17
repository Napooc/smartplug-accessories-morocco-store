
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { CustomerInfo } from '@/lib/types';
import { toast } from 'sonner';

type OrderResult = {
  success: boolean;
  orderId?: string;
  orderTotal?: number;
  orderDate?: string;
  error?: string;
};

export function useCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart, cartTotal, clearCart, placeOrder } = useStore();
  
  const processOrder = async (customerData: CustomerInfo): Promise<OrderResult> => {
    if (isProcessing) {
      console.log('Order already processing, please wait');
      return { success: false, error: 'An order is already being processed' };
    }
    
    if (cart.length === 0) {
      console.log('Cannot place order with empty cart');
      return { success: false, error: 'Your cart is empty' };
    }
    
    try {
      setIsProcessing(true);
      
      // Validate customer data
      if (!validateCustomerData(customerData)) {
        console.error('Invalid customer data:', customerData);
        setIsProcessing(false);
        return { success: false, error: 'Please complete all required fields' };
      }
      
      console.log('Processing order with validated customer data:', customerData);
      
      // Prepare customer data for Supabase
      const processedCustomerData = prepareCustomerData(customerData);
      
      // Place the order directly to Supabase via the store function
      const result = await placeOrder(processedCustomerData);
      
      console.log('Order placement result:', result);
      
      if (result) {
        clearCart();
        return {
          success: true,
          orderId: result.id,
          orderTotal: result.total,
          orderDate: result.date
        };
      } else {
        console.error('Order placement failed without error');
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
    if (!data) {
      console.error('Customer data is null or undefined');
      return false;
    }
    
    const requiredFields = ['name', 'phone', 'city'];
    const missingFields = requiredFields.filter(field => !data[field as keyof CustomerInfo]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return false;
    }
    
    // Validate field contents
    if (typeof data.name !== 'string' || data.name.trim().length < 2) {
      console.error('Invalid name:', data.name);
      return false;
    }
    
    if (typeof data.phone !== 'string' || data.phone.trim().length < 8) {
      console.error('Invalid phone:', data.phone);
      return false;
    }
    
    if (typeof data.city !== 'string' || data.city.trim().length < 1) {
      console.error('Invalid city:', data.city);
      return false;
    }
    
    return true;
  };
  
  // Prepare customer data for Supabase
  const prepareCustomerData = (data: CustomerInfo): CustomerInfo => {
    // Create a deep copy to avoid mutation issues
    const processedData = JSON.parse(JSON.stringify(data));
    
    // Ensure all required fields are present
    processedData.country = processedData.country || 'Morocco';
    processedData.firstName = processedData.firstName || (processedData.name?.split(' ')[0] || '');
    processedData.lastName = processedData.lastName || (processedData.name?.split(' ').slice(1).join(' ') || '');
    processedData.email = processedData.email || 'customer@example.com';
    processedData.address = processedData.address || `${processedData.city}, Morocco`;
    processedData.postalCode = processedData.postalCode || '00000';
    
    return processedData;
  };
  
  return {
    isProcessing,
    processOrder
  };
}
