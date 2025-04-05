
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from "@/integrations/supabase/client";
import { CartItem, CustomerInfo, Product, Order, OrderStatus, ContactMessage } from './types';
import { products as initialProducts, mockOrders } from './data';
import { toast } from 'sonner';

// Define the store state and actions
type State = {
  // Products
  products: Product[];
  featuredProducts: Product[];
  saleProducts: Product[];
  cart: CartItem[];
  customerInfo: CustomerInfo | null;
  orders: Order[];
  contactMessages: ContactMessage[];
  isAdmin: boolean;
  cartTotal: number;
};

type Actions = {
  // Product actions
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  searchProducts: (query: string) => Product[];
  
  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Checkout actions
  setCustomerInfo: (info: CustomerInfo) => void;
  placeOrder: () => Promise<Order | undefined>;
  
  // Order actions
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Contact actions
  addContactMessage: (message: Omit<ContactMessage, 'id' | 'date'>) => void;
  deleteContactMessage: (messageId: string) => void;
  
  // Admin actions
  login: () => void;
  logout: () => void;
};

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      // State
      products: initialProducts,
      get featuredProducts() {
        return get().products.filter(product => product.featured);
      },
      get saleProducts() {
        return get().products.filter(product => product.onSale);
      },
      cart: [],
      customerInfo: null,
      orders: mockOrders,
      contactMessages: [],
      isAdmin: false,
      get cartTotal() {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity, 
          0
        );
      },
      
      // Product actions
      getProductById: (id) => {
        return get().products.find(product => product.id === id);
      },
      
      getProductsByCategory: (category) => {
        return get().products.filter(product => product.category === category);
      },
      
      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: `prod-${Date.now()}`
        };
        
        set(state => ({ products: [...state.products, newProduct] }));
        toast.success(`${product.name} added to products`);
      },
      
      updateProduct: (id, productUpdate) => {
        set(state => ({
          products: state.products.map(product => 
            product.id === id ? { ...product, ...productUpdate } : product
          )
        }));
        toast.success('Product updated successfully');
      },
      
      deleteProduct: (id) => {
        set(state => ({
          products: state.products.filter(product => product.id !== id)
        }));
        toast.success('Product deleted successfully');
      },
      
      searchProducts: (query) => {
        if (!query.trim()) return [];
        
        const lowerCaseQuery = query.toLowerCase().trim();
        
        return get().products.filter(product => 
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery) ||
          product.category.toLowerCase().includes(lowerCaseQuery)
        );
      },
      
      // Cart actions
      addToCart: (product, quantity = 1) => {
        set(state => {
          const existingItem = state.cart.find(item => item.product.id === product.id);
          
          if (existingItem) {
            return {
              cart: state.cart.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          } else {
            return {
              cart: [...state.cart, { product, quantity }]
            };
          }
        });
        
        toast.success(`${product.name} added to cart`);
      },
      
      removeFromCart: (productId) => {
        set(state => ({
          cart: state.cart.filter(item => item.product.id !== productId)
        }));
        toast.info("Item removed from cart");
      },
      
      updateCartItemQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        
        set(state => ({
          cart: state.cart.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({ cart: [] });
      },
      
      // Checkout actions
      setCustomerInfo: (info) => {
        set({ customerInfo: info });
      },
      
      placeOrder: async () => {
        const { customerInfo, cart, cartTotal } = get();
        
        if (!customerInfo || cart.length === 0) return undefined;
        
        // Prepare the order data for Supabase
        const orderData = {
          customer_info: customerInfo,
          items: cart,
          status: 'pending',
          total: cartTotal,
          date: new Date().toISOString().split('T')[0]
        };
        
        try {
          // Insert the order into Supabase
          const { data, error } = await supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single();
            
          if (error) {
            console.error('Error creating order:', error);
            toast.error('Failed to place order');
            return undefined;
          }
          
          // Format the returned data to match the Order type
          const newOrder: Order = {
            id: data.id,
            items: data.items,
            status: data.status,
            customer: data.customer_info,
            date: data.date,
            total: data.total
          };
          
          // Update local state
          set(state => ({
            orders: [...state.orders, newOrder],
            cart: [],
            customerInfo: null
          }));
          
          toast.success("Order placed successfully!");
          return newOrder;
        } catch (err) {
          console.error('Error placing order:', err);
          toast.error('Failed to place order');
          return undefined;
        }
      },
      
      // Order actions
      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, status }
              : order
          )
        }));
        
        toast.success(`Order ${orderId} updated to ${status}`);
      },
      
      // Contact actions
      addContactMessage: (message) => {
        const newMessage: ContactMessage = {
          ...message,
          id: `msg-${Date.now()}`,
          date: new Date().toISOString().split('T')[0]
        };
        
        set(state => ({
          contactMessages: [newMessage, ...state.contactMessages]
        }));
      },
      
      deleteContactMessage: (messageId) => {
        set(state => ({
          contactMessages: state.contactMessages.filter(message => message.id !== messageId)
        }));
      },
      
      // Admin actions
      login: () => {
        set({ isAdmin: true });
        localStorage.setItem('smartplug-admin', 'true');
      },
      
      logout: () => {
        set({ isAdmin: false });
        localStorage.removeItem('smartplug-admin');
      }
    }),
    {
      name: 'smartplug-storage',
    }
  )
);
