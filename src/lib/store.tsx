import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { CartItem, CustomerInfo, Product, Order, OrderStatus, ContactMessage } from './types';
import { products as initialProducts } from './data';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

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
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Contact
  contactMessages: ContactMessage[];
  addContactMessage: (message: Omit<ContactMessage, 'id' | 'date'>) => Promise<void>;
  deleteContactMessage: (messageId: string) => void;
  fetchContactMessages: () => Promise<void>;

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  
  useEffect(() => {
    const savedCart = localStorage.getItem('smartplug-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing saved cart', e);
      }
    }

    const adminLoggedIn = localStorage.getItem('smartplug-admin');
    if (adminLoggedIn === 'true') {
      setIsAdmin(true);
    }

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
        console.error('Error fetching products:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const formattedProducts: Product[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          oldPrice: item.old_price ? Number(item.old_price) : 0,
          images: item.images,
          category: item.category,
          featured: item.featured,
          onSale: item.on_sale,
          rating: item.rating,
          stock: item.stock,
          sku: item.sku
        }));
        
        setProducts(formattedProducts);
      } else {
        initialProducts.forEach(product => {
          addProductToSupabase(product);
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProductToSupabase = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          old_price: product.oldPrice > 0 ? product.oldPrice : null,
          images: product.images,
          category: product.category,
          featured: product.featured,
          on_sale: product.onSale,
          rating: product.rating,
          stock: product.stock,
          sku: product.sku || `SKU-${Date.now()}`
        });
      
      if (error) {
        console.error('Error adding product to Supabase:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error adding product to Supabase:', error);
      throw error;
    }
  };
  
  const fetchContactMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching contact messages:', error);
        return;
      }
      
      if (data) {
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
  }, []);
  
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
      const productToAdd = {
        name: product.name,
        description: product.description,
        price: product.price,
        old_price: product.oldPrice > 0 ? product.oldPrice : null,
        images: product.images,
        category: product.category,
        featured: product.featured,
        on_sale: product.onSale,
        rating: product.rating || 0,
        stock: product.stock || 0,
        sku: product.sku || `SKU-${Date.now()}`
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert(productToAdd)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding product to Supabase:', error);
        toast.error('Failed to add product');
        return;
      }
      
      if (data) {
        const newProduct: Product = {
          id: data.id,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          oldPrice: data.old_price ? Number(data.old_price) : 0,
          images: data.images,
          category: data.category,
          featured: data.featured,
          onSale: data.on_sale,
          rating: data.rating,
          stock: data.stock,
          sku: data.sku
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
      const supabaseUpdate: any = {
        ...(productUpdate.name && { name: productUpdate.name }),
        ...(productUpdate.description && { description: productUpdate.description }),
        ...(productUpdate.price && { price: productUpdate.price }),
        ...(productUpdate.oldPrice !== undefined && { old_price: productUpdate.oldPrice > 0 ? productUpdate.oldPrice : null }),
        ...(productUpdate.images && { images: productUpdate.images }),
        ...(productUpdate.category && { category: productUpdate.category }),
        ...(productUpdate.featured !== undefined && { featured: productUpdate.featured }),
        ...(productUpdate.onSale !== undefined && { on_sale: productUpdate.onSale }),
        ...(productUpdate.rating !== undefined && { rating: productUpdate.rating }),
        ...(productUpdate.stock !== undefined && { stock: productUpdate.stock }),
        ...(productUpdate.sku && { sku: productUpdate.sku })
      };
      
      const { error } = await supabase
        .from('products')
        .update(supabaseUpdate)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating product in Supabase:', error);
        toast.error('Failed to update product');
        return;
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
        console.error('Error deleting product from Supabase:', error);
        toast.error('Failed to delete product');
        return;
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
  
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }
      
      if (data) {
        const formattedOrders: Order[] = data.map(order => ({
          id: order.id,
          items: order.items as unknown as CartItem[],
          status: order.status as OrderStatus,
          customer: order.customer_info as unknown as CustomerInfo,
          date: new Date(order.date).toISOString().split('T')[0],
          total: order.total
        }));
        
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  const placeOrder = async () => {
    if (!customerInfo || cart.length === 0) return undefined;
    
    try {
      const orderData = {
        customer_info: customerInfo as unknown as Database['public']['Tables']['orders']['Insert']['customer_info'],
        items: cart as unknown as Database['public']['Tables']['orders']['Insert']['items'],
        status: 'pending' as OrderStatus,
        total: cartTotal,
        date: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
      
      if (error) {
        console.error('Error saving order:', error);
        throw new Error('Failed to place order. Please try again.');
      }

      if (!data) {
        throw new Error('Failed to place order. No data returned.');
      }

      const newOrder: Order = {
        id: data.id,
        items: data.items as unknown as CartItem[],
        status: data.status as OrderStatus,
        customer: data.customer_info as unknown as CustomerInfo,
        date: new Date(data.date).toISOString().split('T')[0],
        total: data.total
      };
      
      setOrders(prevOrders => [...prevOrders, newOrder]);
      clearCart();
      setCustomerInfo(null);
      
      toast.success("Order placed successfully!");
      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
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
        console.error('Error updating order status:', error);
        toast.error('Failed to update order status');
        return;
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
      const currentDate = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: message.name,
          email: message.email,
          subject: message.subject || null,
          message: message.message,
          date: currentDate
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving contact message:', error);
        throw new Error('Failed to send message');
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
    } catch (error) {
      console.error('Error saving contact message:', error);
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
        console.error('Error deleting contact message:', error);
        toast.error('Failed to delete message');
        return;
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
    fetchOrders,
    updateOrderStatus,
    contactMessages,
    addContactMessage,
    deleteContactMessage,
    fetchContactMessages,
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
