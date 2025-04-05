
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, CustomerInfo, Product, Order, OrderStatus, ContactMessage } from './types';
import { products as initialProducts, mockOrders } from './data';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

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
  placeOrder: () => Promise<Order>;
  
  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Contact
  contactMessages: ContactMessage[];
  addContactMessage: (message: Omit<ContactMessage, 'id' | 'date'>) => void;
  deleteContactMessage: (messageId: string) => void;

  // Admin
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
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

    // Fetch products from Supabase
    fetchProducts();
    fetchOrders();
    fetchContactMessages();
  }, []);
  
  useEffect(() => {
    localStorage.setItem('smartplug-cart', JSON.stringify(cart));
  }, [cart]);
  
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const formattedProducts: Product[] = data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          oldPrice: product.old_price ? Number(product.old_price) : undefined,
          images: product.images,
          category: product.category,
          rating: Number(product.rating),
          stock: Number(product.stock),
          sku: product.sku,
          featured: product.featured || false,
          onSale: product.on_sale || false
        }));
        
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // If there's an error, use the initial products as fallback
    }
  };
  
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const formattedOrders: Order[] = data.map(order => ({
          id: order.id,
          items: typeof order.items === 'string' 
            ? JSON.parse(order.items) 
            : order.items as unknown as CartItem[],
          status: order.status as OrderStatus,
          customer: typeof order.customer_info === 'string'
            ? JSON.parse(order.customer_info)
            : order.customer_info as unknown as CustomerInfo,
          date: new Date(order.date).toISOString().split('T')[0],
          total: Number(order.total)
        }));
        
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // If there's an error, use the mock orders as fallback
    }
  };
  
  const fetchContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const formattedMessages: ContactMessage[] = data.map(msg => ({
          id: msg.id,
          name: msg.name,
          email: msg.email,
          subject: msg.subject || '',
          message: msg.message,
          date: new Date(msg.date).toISOString().split('T')[0]
        }));
        
        setContactMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
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
  
  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          price: product.price,
          old_price: product.oldPrice || null,
          category: product.category,
          sku: product.sku,
          stock: product.stock,
          featured: product.featured || false,
          on_sale: product.onSale || false,
          images: product.images,
          rating: product.rating
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const newProduct: Product = {
          id: data.id,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          oldPrice: data.old_price ? Number(data.old_price) : undefined,
          images: data.images,
          category: data.category,
          rating: Number(data.rating),
          stock: Number(data.stock),
          sku: data.sku,
          featured: data.featured || false,
          onSale: data.on_sale || false
        };
        
        setProducts(prevProducts => [...prevProducts, newProduct]);
        toast.success(`${product.name} added to products`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };
  
  const updateProduct = async (id: string, productUpdate: Partial<Product>) => {
    try {
      // Prepare the data for Supabase (convert field names)
      const supabaseData: Record<string, any> = {};
      
      if (productUpdate.name !== undefined) supabaseData.name = productUpdate.name;
      if (productUpdate.description !== undefined) supabaseData.description = productUpdate.description;
      if (productUpdate.price !== undefined) supabaseData.price = productUpdate.price;
      if (productUpdate.oldPrice !== undefined) supabaseData.old_price = productUpdate.oldPrice;
      if (productUpdate.images !== undefined) supabaseData.images = productUpdate.images;
      if (productUpdate.category !== undefined) supabaseData.category = productUpdate.category;
      if (productUpdate.rating !== undefined) supabaseData.rating = productUpdate.rating;
      if (productUpdate.stock !== undefined) supabaseData.stock = productUpdate.stock;
      if (productUpdate.sku !== undefined) supabaseData.sku = productUpdate.sku;
      if (productUpdate.featured !== undefined) supabaseData.featured = productUpdate.featured;
      if (productUpdate.onSale !== undefined) supabaseData.on_sale = productUpdate.onSale;
      
      const { error } = await supabase
        .from('products')
        .update(supabaseData)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? { ...product, ...productUpdate } : product
        )
      );
      
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
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
      toast.error('Failed to delete product');
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
  
  const placeOrder = async (): Promise<Order> => {
    if (!customerInfo || cart.length === 0) {
      throw new Error('Missing customer information or empty cart');
    }
    
    const newOrderId = `ORD-${Math.floor(Math.random() * 1000)}`;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_info: customerInfo,
          items: cart,
          status: 'pending',
          total: cartTotal,
          date: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newOrder: Order = {
        id: data.id,
        items: cart,
        status: 'pending',
        customer: customerInfo,
        date: new Date().toISOString().split('T')[0],
        total: cartTotal
      };
      
      setOrders(prevOrders => [...prevOrders, newOrder]);
      clearCart();
      setCustomerInfo(null);
      
      toast.success("Order placed successfully!");
      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
      throw error;
    }
  };
  
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
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
      toast.error('Failed to update order status');
    }
  };
  
  const addContactMessage = async (message: Omit<ContactMessage, 'id' | 'date'>) => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: message.name,
          email: message.email,
          subject: message.subject,
          message: message.message,
          date: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newMessage: ContactMessage = {
        id: data.id,
        name: data.name,
        email: data.email,
        subject: data.subject || '',
        message: data.message,
        date: new Date(data.date).toISOString().split('T')[0]
      };
      
      setContactMessages(prev => [newMessage, ...prev]);
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast.error('Failed to send message');
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
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting contact message:', error);
      toast.error('Failed to delete message');
    }
  };
  
  const login = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('smartplug-admin', 'true');
      return true;
    }
    return false;
  };
  
  const logout = () => {
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
