
import { create } from 'zustand';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Product, CartItem, Order, CustomerInfo } from './types';
import { toast } from 'sonner';

// Define the store state type
interface State {
  // User state
  user: { isLoggedIn: boolean; isAdmin: boolean } | null;
  // Products state
  products: Product[];
  featuredProducts: Product[];
  // Cart state
  cart: CartItem[];
  // Customer info
  customerInfo: CustomerInfo | null;
  // Orders
  orders: Order[];
  // Contact messages
  contactMessages: any[];
}

// Define the store actions type
interface Actions {
  // Authentication actions
  login: () => void;
  logout: () => void;
  // Product actions
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  cartTotal: () => number;
  // Checkout actions
  setCustomerInfo: (info: CustomerInfo) => void;
  placeOrder: () => Promise<Order>;
  // Order actions
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: string) => void;
  // Contact form actions
  addContactMessage: (message: any) => void;
  deleteContactMessage: (id: string) => void;
}

// Create the store
export const useStore = create<State & Actions>((set, get) => ({
  // Initial state
  user: null,
  products: [],
  featuredProducts: [],
  cart: [],
  customerInfo: null,
  orders: [],
  contactMessages: [],

  // Authentication actions
  login: () => set({ user: { isLoggedIn: true, isAdmin: true } }),
  logout: () => set({ user: null }),

  // Product actions
  getProductById: (id) => get().products.find(p => p.id === id),
  getProductsByCategory: (category) => get().products.filter(p => p.category === category),
  addProduct: (product) => set(state => ({ products: [...state.products, product] })),
  updateProduct: (product) => set(state => ({
    products: state.products.map(p => p.id === product.id ? product : p)
  })),
  deleteProduct: (id) => set(state => ({
    products: state.products.filter(p => p.id !== id)
  })),

  // Cart actions
  addToCart: (product, quantity = 1) => {
    const cart = get().cart;
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      });
    } else {
      set({
        cart: [...cart, { productId: product.id, product, quantity }]
      });
    }
    
    toast.success(`${product.name} added to cart`);
  },
  
  removeFromCart: (productId) => set(state => ({
    cart: state.cart.filter(item => item.productId !== productId)
  })),
  
  clearCart: () => set({ cart: [] }),
  
  updateCartItemQuantity: (productId, quantity) => set(state => ({
    cart: state.cart.map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    )
  })),
  
  cartTotal: () => {
    return get().cart.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);
  },

  // Checkout actions
  setCustomerInfo: (info) => set({ customerInfo: info }),
  
  placeOrder: async () => {
    const { cart, customerInfo, cartTotal } = get();
    
    if (!customerInfo) {
      throw new Error('Customer information is required');
    }
    
    try {
      // Format the order for Supabase
      const orderData = {
        customer_info: customerInfo,
        items: cart,
        status: 'pending',
        total: cartTotal(),
        date: format(new Date(), 'yyyy-MM-dd')
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('No data returned from order creation');
      }
      
      // Transform Supabase response to Order type
      const order: Order = {
        id: data.id,
        customer: customerInfo,
        items: cart,
        status: data.status,
        total: data.total,
        date: data.date,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      // Update local state
      set(state => ({
        orders: [...state.orders, order],
        cart: [] // Clear cart after successful order
      }));
      
      return order;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  },

  // Order actions
  getOrderById: (id) => get().orders.find(o => o.id === id),
  
  updateOrderStatus: (orderId, status) => set(state => ({
    orders: state.orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    )
  })),

  // Contact form actions
  addContactMessage: (message) => set(state => ({
    contactMessages: [...state.contactMessages, message]
  })),
  
  deleteContactMessage: (id) => set(state => ({
    contactMessages: state.contactMessages.filter(msg => msg.id !== id)
  }))
}));

// Helper to check if user is admin
export const isAdmin = () => {
  const { user } = useStore.getState();
  return user?.isAdmin || false;
};
