
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, CustomerInfo, Product, Order, OrderStatus, ContactMessage } from './types';
import { products as initialProducts, mockOrders } from './data';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface StoreContextType {
  // Products
  products: Product[];
  featuredProducts: Product[];
  saleProducts: Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  searchProducts: (query: string) => Product[];
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  
  // Checkout
  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;
  placeOrder: () => Promise<Order | undefined>;
  
  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Contact
  contactMessages: ContactMessage[];
  addContactMessage: (message: Omit<ContactMessage, 'id' | 'date'>) => Promise<void>;
  deleteContactMessage: (messageId: string) => Promise<void>;
  loadContactMessages: () => Promise<void>;

  // Admin
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  
  useEffect(() => {
    const savedCart = localStorage.getItem('smartplug-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (e) {
        console.error("Failed to parse cart from localStorage:", e);
      }
    }
    
    const adminLoggedIn = localStorage.getItem('smartplug-admin');
    if (adminLoggedIn === 'true') {
      setIsAdmin(true);
    }

    // Load products from Supabase
    loadProducts();
    loadOrders();
    loadContactMessages();

  }, []);
  
  useEffect(() => {
    localStorage.setItem('smartplug-cart', JSON.stringify(cart));
  }, [cart]);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Transform the data to match our Product interface
        const transformedProducts: Product[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          oldPrice: item.old_price ? Number(item.old_price) : undefined,
          images: item.images,
          category: item.category,
          rating: item.rating,
          stock: item.stock,
          sku: item.sku,
          featured: item.featured,
          onSale: item.on_sale
        }));
        setProducts(transformedProducts);
      } else {
        // If no products in Supabase, use initial products
        setProducts(initialProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
      setProducts(initialProducts);
    }
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const transformedOrders: Order[] = data.map(item => ({
          id: item.id,
          items: item.items,
          status: item.status as OrderStatus,
          customer: item.customer_info,
          date: new Date(item.date).toISOString().split('T')[0],
          total: Number(item.total)
        }));
        setOrders(transformedOrders);
      } else {
        setOrders(mockOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      setOrders(mockOrders);
    }
  };

  const loadContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const transformedMessages: ContactMessage[] = data.map(item => ({
          id: item.id,
          name: item.name,
          email: item.email,
          subject: item.subject || undefined,
          message: item.message,
          date: new Date(item.date).toISOString().split('T')[0]
        }));
        setContactMessages(transformedMessages);
      }
    } catch (error) {
      console.error('Error loading contact messages:', error);
    }
  };
  
  const featuredProducts = products.filter(product => product.featured);
  const saleProducts = products.filter(product => product.onSale);
  
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  );
  
  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };
  
  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };
  
  const searchProducts = (query: string) => {
    if (!query.trim()) return [];
    
    const lowerCaseQuery = query.toLowerCase().trim();
    
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
    );
  };
  
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    toast.success(`${product.name} added to products`);
  };
  
  const updateProduct = (id: string, productUpdate: Partial<Product>) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? { ...product, ...productUpdate } : product
      )
    );
    toast.success('Product updated successfully');
  };
  
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
    }
  };
  
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
    
    toast.success(`${product.name} added to cart`);
  };
  
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    toast.info("Item removed from cart");
  };
  
  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  const placeOrder = async () => {
    if (!customerInfo || cart.length === 0) return undefined;
    
    try {
      const orderId = `ORD-${Math.floor(Math.random() * 1000)}`;

      const newOrder: Order = {
        id: orderId,
        items: [...cart],
        status: 'pending',
        customer: customerInfo,
        date: new Date().toISOString().split('T')[0],
        total: cartTotal
      };
      
      // Insert order into Supabase
      const { error } = await supabase
        .from('orders')
        .insert({
          id: newOrder.id,
          items: newOrder.items,
          status: newOrder.status,
          customer_info: newOrder.customer,
          date: new Date().toISOString(),
          total: newOrder.total
        });

      if (error) {
        throw error;
      }

      setOrders(prevOrders => [newOrder, ...prevOrders]);
      clearCart();
      setCustomerInfo(null);
      
      toast.success("Order placed successfully!");
      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
      return undefined;
    }
  };
  
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: status })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );
      
      toast.success(`Order ${orderId} updated to ${status}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status. Please try again.');
    }
  };
  
  const addContactMessage = async (message: Omit<ContactMessage, 'id' | 'date'>) => {
    try {
      // Insert message into Supabase
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: message.name,
          email: message.email,
          subject: message.subject || null,
          message: message.message,
          date: new Date().toISOString()
        })
        .select();

      if (error) {
        throw error;
      }

      const newMessage: ContactMessage = {
        id: data[0].id,
        ...message,
        date: new Date().toISOString().split('T')[0]
      };
      
      setContactMessages(prev => [newMessage, ...prev]);
    } catch (error) {
      console.error('Error adding contact message:', error);
      throw error;
    }
  };
  
  const deleteContactMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        throw error;
      }

      setContactMessages(prev => prev.filter(message => message.id !== messageId));
    } catch (error) {
      console.error('Error deleting contact message:', error);
      throw error;
    }
  };
  
  const login = async (username: string, password: string) => {
    // In a real app, use Supabase auth
    if (username === 'admin' && password === 'admin123') {
      try {
        // Sign in using Supabase auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@example.com',
          password: 'admin123'
        });

        if (error) {
          console.log('Using test credentials instead of Supabase auth');
          // Fall back to our mock auth for development
          setIsAdmin(true);
          localStorage.setItem('smartplug-admin', 'true');
          return true;
        }

        if (data.user) {
          setIsAdmin(true);
          localStorage.setItem('smartplug-admin', 'true');
          return true;
        }

        return false;
      } catch (error) {
        console.error('Login error:', error);
        // Fall back to our mock auth for development
        setIsAdmin(true);
        localStorage.setItem('smartplug-admin', 'true');
        return true;
      }
    }
    return false;
  };
  
  const logout = () => {
    // Sign out from Supabase
    supabase.auth.signOut().catch(error => {
      console.error('Error signing out:', error);
    });

    setIsAdmin(false);
    localStorage.removeItem('smartplug-admin');
  };
  
  const value = {
    products,
    featuredProducts,
    saleProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartTotal,
    customerInfo,
    setCustomerInfo,
    placeOrder,
    orders,
    updateOrderStatus,
    contactMessages,
    addContactMessage,
    deleteContactMessage,
    loadContactMessages,
    isAdmin,
    login,
    logout
  };
  
  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
