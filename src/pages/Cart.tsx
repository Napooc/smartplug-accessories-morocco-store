
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal } = useStore();
  
  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity >= 1) {
      updateCartItemQuantity(productId, quantity);
    }
  };
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="mb-8">
            <ShoppingCart size={64} className="mx-auto text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center bg-smartplug-blue hover:bg-smartplug-lightblue text-white font-medium py-3 px-8 rounded-md transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <tr key={item.product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-16 w-16 object-cover rounded"
                          />
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{item.product.name}</div>
                            <div className="text-sm text-gray-500">{item.product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.product.price} DH
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-300"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(item.product.price * item.quantity).toFixed(2)} DH
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{cartTotal().toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t pt-3 mb-6">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{cartTotal().toFixed(2)} DH</span>
                </div>
              </div>
              
              <Button
                onClick={handleCheckout}
                className="w-full bg-smartplug-blue hover:bg-smartplug-lightblue flex items-center justify-center"
              >
                Checkout
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
