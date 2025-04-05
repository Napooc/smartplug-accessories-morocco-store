
import { create } from 'zustand';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Product, CartItem, Order, CustomerInfo, OrderStatus, ContactMessage, ProductFilter } from './types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Define the store state type
interface State {
  // User state
  user: { isLoggedIn: boolean; isAdmin: boolean } | null;
  // Products state
  products: Product[];
  featuredProducts: Product[];
  saleProducts: Product[]; // Adding this for Index.tsx
  // Cart state
  cart: CartItem[];
  // Customer info
  customerInfo: CustomerInfo | null;
  // Orders
  orders: Order[];
  // Contact messages
  contactMessages: ContactMessage[];
}

// Define the store actions type
interface Actions {
  // Authentication actions
  login: () => void;
  logout: () => void;
  // Product actions
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  addProduct: (productData: Omit<Product, 'id'>) => void;
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
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  // Contact form actions
  addContactMessage: (message: Omit<ContactMessage, 'id' | 'date'>) => void;
  deleteContactMessage: (id: string) => void;
}

// Helper to check if user is admin
export const isAdmin = () => {
  const { user } = useStore.getState();
  return user?.isAdmin || false;
};

// Create the store
export const useStore = create<State & Actions>((set, get) => ({
  // Initial state
  user: null,
  products: [],
  featuredProducts: [],
  saleProducts: [], // Initialize saleProducts array
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
  searchProducts: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) || 
      product.description.toLowerCase().includes(lowerQuery)
    );
  },
  addProduct: (productData) => {
    const newProduct: Product = {
      ...productData,
      id: uuidv4() // Generate a new ID for the product
    };
    set(state => ({ products: [...state.products, newProduct] }));
  },
  updateProduct: (product) => set(state => ({
    products: state.products.map(p => p.id === product.id ? product : p)
  })),
  deleteProduct: (id) => set(state => ({
    products: state.products.filter(p => p.id !== id)
  })),

  // Cart actions
  addToCart: (product, quantity = 1) => {
    const cart = get().cart;
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      });
    } else {
      set({
        cart: [...cart, { product, quantity }]
      });
    }
    
    toast.success(`${product.name} added to cart`);
  },
  
  removeFromCart: (productId) => set(state => ({
    cart: state.cart.filter(item => item.product.id !== productId)
  })),
  
  clearCart: () => set({ cart: [] }),
  
  updateCartItemQuantity: (productId, quantity) => set(state => ({
    cart: state.cart.map(item =>
      item.product.id === productId
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
        customer_info: customerInfo as any, // Type assertion to bypass Supabase JSON validation
        items: cart as any, // Type assertion to bypass Supabase JSON validation
        status: 'pending' as OrderStatus,
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
        status: data.status as OrderStatus,
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
  addContactMessage: (message) => {
    const newMessage: ContactMessage = {
      id: uuidv4(),
      date: new Date().toISOString(),
      ...message
    };
    
    set(state => ({
      contactMessages: [...state.contactMessages, newMessage]
    }));
  },
  
  deleteContactMessage: (id) => set(state => ({
    contactMessages: state.contactMessages.filter(msg => msg.id !== id)
  }))
}));
