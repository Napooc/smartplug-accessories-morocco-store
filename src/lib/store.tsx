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
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const savedCart = localStorage.getItem('smartplug-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }

    const adminLoggedIn = localStorage.getItem('smartplug-admin');
    if (adminLoggedIn === 'true') {
      setIsAdmin(true);
    }

    fetchProducts().then(() => {
      setIsLoading(false);
    });
    
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
        setProducts(initialProducts); // Fall back to initial products
        return;
      }
      
      if (data && data.length > 0) {
        const formattedProducts: Product[] = data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          oldPrice: product.old_price || 0,
          category: product.category,
          images: product.images,
          featured: product.featured,
          onSale: product.on_sale,
          stock: product.stock,
          rating: product.rating || 0,
          sku: product.sku
        }));
        
        setProducts(formattedProducts);
      } else {
        setProducts(initialProducts);
        
        for (const product of initialProducts) {
          await supabase
            .from('products')
            .insert({
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              old_price: product.oldPrice,
              category: product.category,
              images: product.images,
              featured: product.featured,
              on_sale: product.onSale,
              stock: product.stock,
              rating: product.rating,
              sku: product.sku || `SKU-${Math.floor(Math.random() * 10000)}`
            });
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(initialProducts); // Fall back to initial products
    }
  };
  
  const fetchContactMessages = useCallback(async () => {
    try {
      console.log("Fetching contact messages...");
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching contact messages:', error);
        throw error;
      }
      
      if (data) {
        console.log("Contact messages fetched:", data.length);
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
      throw error;
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
      const newProduct = {
        name: product.name,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice,
        category: product.category,
        images: product.images,
        featured: product.featured,
        onSale: product.onSale,
        stock: product.stock,
        rating: product.rating || 0,
        sku: product.sku || `SKU-${Math.floor(Math.random() * 10000)}`
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert(newProduct)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding product:', error);
        toast.error("Erreur lors de l'ajout du produit");
        throw error;
      }
      
      const formattedProduct: Product = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        oldPrice: data.old_price || 0,
        category: data.category,
        images: data.images,
        featured: data.featured,
        onSale: data.on_sale,
        stock: data.stock,
        rating: data.rating || 0,
        sku: data.sku
      };
      
      setProducts(prevProducts => [...prevProducts, formattedProduct]);
      toast.success(`${product.name} ajouté aux produits`);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };
  
  const updateProduct = async (id: string, productUpdate: Partial<Product>) => {
    try {
      const dbUpdate: any = {};
      
      if (productUpdate.name !== undefined) dbUpdate.name = productUpdate.name;
      if (productUpdate.description !== undefined) dbUpdate.description = productUpdate.description;
      if (productUpdate.price !== undefined) dbUpdate.price = productUpdate.price;
      if (productUpdate.oldPrice !== undefined) dbUpdate.old_price = productUpdate.oldPrice;
      if (productUpdate.category !== undefined) dbUpdate.category = productUpdate.category;
      if (productUpdate.images !== undefined) dbUpdate.images = productUpdate.images;
      if (productUpdate.featured !== undefined) dbUpdate.featured = productUpdate.featured;
      if (productUpdate.onSale !== undefined) dbUpdate.on_sale = productUpdate.onSale;
      if (productUpdate.stock !== undefined) dbUpdate.stock = productUpdate.stock;
      if (productUpdate.rating !== undefined) dbUpdate.rating = productUpdate.rating;
      if (productUpdate.sku !== undefined) dbUpdate.sku = productUpdate.sku;
      
      const { error } = await supabase
        .from('products')
        .update(dbUpdate)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating product:', error);
        toast.error("Erreur lors de la mise à jour du produit");
        throw error;
      }
      
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? { ...product, ...productUpdate } : product
        )
      );
      toast.success('Produit mis à jour avec succès');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };
  
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        toast.error("Erreur lors de la suppression du produit");
        throw error;
      }
      
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      toast.success('Produit supprimé avec succès');
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
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
    
    toast.success(`${product.name} ajouté au panier`);
  };
  
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    toast.info("Article retiré du panier");
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
      
      toast.success("Commande passée avec succès!");
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
        toast.error('Échec de la mise à jour du statut de la commande');
        return;
      }
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );
      
      toast.success(`Commande ${orderId} mise à jour en ${status}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Échec de la mise à jour du statut de la commande');
    }
  };
  
  const addContactMessage = async (message: Omit<ContactMessage, 'id' | 'date'>): Promise<void> => {
    try {
      console.log("Adding contact message:", message);
      const currentDate = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: message.name,
          email: message.email,
          subject: message.subject || null,
          message: message.message,
          date: currentDate
        });
      
      if (error) {
        console.error('Error saving contact message:', error);
        throw new Error('Failed to send message');
      }
      
      console.log("Contact message added successfully");
      
      // Refresh the messages
      await fetchContactMessages();
    } catch (error) {
      console.error('Error saving contact message:', error);
      throw error;
    }
  };
  
  const deleteContactMessage = async (messageId: string) => {
    try {
      console.log("Deleting contact message:", messageId);
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);
      
      if (error) {
        console.error('Error deleting contact message:', error);
        toast.error('Échec de la suppression du message');
        return;
      }
      
      setContactMessages(prev => prev.filter(message => message.id !== messageId));
      toast.success('Message supprimé avec succès');
    } catch (error) {
      console.error('Error deleting contact message:', error);
      toast.error('Échec de la suppression du message');
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
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-smartplug-blue"></div>
        </div>
      ) : (
        children
      )}
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
