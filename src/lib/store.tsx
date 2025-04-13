import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { CartItem, CustomerInfo, Product, Order, OrderStatus, ContactMessage } from './types';
import { products as initialProducts } from './data';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { v4 as uuidv4 } from 'uuid';

interface StoreContextType {
  // Products
  products: Product[];
  featuredProducts: Product[];
  saleProducts: Product[];
  bestSellingProducts: Product[];
  dealsProducts: Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getProductsByPlacement: (placement: 'best_selling' | 'deals' | 'regular') => Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  searchProducts: (query: string) => Product[];
  fetchProducts: () => Promise<void>;
  
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
  deleteContactMessage: (messageId: string) => Promise<void>;
  fetchContactMessages: () => Promise<void>;

  // Admin
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'smartplug-products',
  CART: 'smartplug-cart',
  ADMIN: 'smartplug-admin'
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize store data on component mount
  useEffect(() => {
    // Restore cart from localStorage
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }

    // Check admin status
    const adminLoggedIn = localStorage.getItem(STORAGE_KEYS.ADMIN);
    if (adminLoggedIn === 'true') {
      setIsAdmin(true);
    }

    // Fetch data from sources
    Promise.all([
      fetchProducts(),
      fetchOrders(),
      fetchContactMessages()
    ]).finally(() => {
      setIsLoading(false);
    });
  }, []);
  
  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  /**
   * Fetches products from Supabase and handles fallback to localStorage if needed
   */
  const fetchProducts = async () => {
    try {
      console.log('Fetching products from Supabase...');
      
      // First try to get products from localStorage for immediate display
      const localProductsJson = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      let localProducts: Product[] = [];
      
      if (localProductsJson) {
        try {
          localProducts = JSON.parse(localProductsJson);
          setProducts(localProducts);
          console.log('Loaded products from localStorage:', localProducts.length);
        } catch (parseError) {
          console.error('Error parsing local products:', parseError);
        }
      }
      
      // Then try to fetch from Supabase for fresh data
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error('Error fetching products from Supabase:', error);
        toast.error("Error loading products from database");
        
        // If we haven't loaded from localStorage yet, use as fallback
        if (localProducts.length === 0 && localProductsJson) {
          try {
            const parsedProducts = JSON.parse(localProductsJson);
            setProducts(parsedProducts);
            return;
          } catch (parseError) {
            console.error('Error parsing local products:', parseError);
          }
        }
        
        // Last resort: use initial sample data
        if (localProducts.length === 0) {
          const productsWithUUIDs = initialProducts.map(product => ({
            ...product,
            id: uuidv4()
          }));
          setProducts(productsWithUUIDs);
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsWithUUIDs));
        }
        
        return;
      }
      
      if (data) {
        if (data.length > 0) {
          console.log('Products fetched successfully from DB:', data.length);
          const formattedProducts: Product[] = data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            oldPrice: product.old_price || undefined,
            category: product.category,
            images: product.images,
            featured: product.featured,
            onSale: product.on_sale,
            stock: product.stock,
            rating: product.rating || 0,
            sku: product.sku
          }));
          
          setProducts(formattedProducts);
          
          // Save to localStorage for offline access
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(formattedProducts));
        } else {
          // No products in DB, initialize with sample data
          console.log('No products found in DB, initializing with sample data');
          
          if (localProducts.length > 0) {
            // Use already loaded localStorage products
            await syncLocalProductsToSupabase(localProducts);
          } else {
            // Generate UUIDs for initial products
            const productsWithUUIDs = initialProducts.map(product => ({
              ...product,
              id: uuidv4()
            }));
            
            setProducts(productsWithUUIDs);
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsWithUUIDs));
            
            // Save initial products to database
            await syncLocalProductsToSupabase(productsWithUUIDs);
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      toast.error("Error loading products");
      
      // Try to get products from localStorage as a fallback
      const localProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (localProducts) {
        try {
          const parsedProducts = JSON.parse(localProducts);
          setProducts(parsedProducts);
        } catch (parseError) {
          console.error('Error parsing local products:', parseError);
          
          // Use initial products as last resort
          const productsWithUUIDs = initialProducts.map(product => ({
            ...product,
            id: uuidv4()
          }));
          
          setProducts(productsWithUUIDs);
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsWithUUIDs));
        }
      } else {
        // Initialize with sample data if nothing else works
        const productsWithUUIDs = initialProducts.map(product => ({
          ...product,
          id: uuidv4()
        }));
        
        setProducts(productsWithUUIDs);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsWithUUIDs));
      }
    }
  };
  
  /**
   * Syncs local products to Supabase database
   */
  const syncLocalProductsToSupabase = async (localProducts: Product[]) => {
    try {
      for (const product of localProducts) {
        await supabase
          .from('products')
          .upsert({
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
          }, { onConflict: 'id' });
      }
      console.log(`Successfully synced ${localProducts.length} products to Supabase`);
    } catch (error) {
      console.error('Error syncing products to Supabase:', error);
      toast.warning('Some products may not be synced to the database');
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
  
  // Computed properties
  const featuredProducts = products.filter(product => product.featured);
  const saleProducts = products.filter(product => product.onSale);
  const bestSellingProducts = products.filter(product => product.placement === 'best_selling');
  const dealsProducts = products.filter(product => product.placement === 'deals');
  
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
  
  const getProductsByPlacement = (placement: 'best_selling' | 'deals' | 'regular') => {
    return products.filter(product => product.placement === placement);
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
  
  /**
   * Adds a new product to the store and syncs to all storage
   */
  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProductId = uuidv4();
      
      const newProduct: Product = {
        id: newProductId,
        name: product.name,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice,
        category: product.category,
        images: product.images,
        featured: product.featured || false,
        onSale: product.onSale || false,
        stock: product.stock || 0,
        rating: product.rating || 0,
        sku: product.sku || `SKU-${Math.floor(Math.random() * 10000)}`
      };
      
      console.log('Adding new product:', newProduct);
      
      // Update local state and localStorage first for immediate feedback
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      
      // Then, update the database
      const { error } = await supabase
        .from('products')
        .insert({
          id: newProduct.id,
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          old_price: newProduct.oldPrice,
          category: newProduct.category,
          images: newProduct.images,
          featured: newProduct.featured,
          on_sale: newProduct.onSale,
          stock: newProduct.stock,
          rating: newProduct.rating,
          sku: newProduct.sku
        });
      
      if (error) {
        console.error('Error adding product to Supabase:', error);
        toast.warning("Product saved locally but not synced to database");
      } else {
        toast.success(`${product.name} added to products`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };
  
  /**
   * Updates an existing product and syncs changes to all storage
   */
  const updateProduct = async (id: string, productUpdate: Partial<Product>) => {
    try {
      console.log("Updating product with ID:", id);
      console.log("Update data:", productUpdate);
      
      // First, update local state and localStorage
      const updatedProducts = products.map(product => 
        product.id === id ? { ...product, ...productUpdate } : product
      );
      
      setProducts(updatedProducts);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      
      // Then, update the database with proper field mapping
      const dbUpdate: Record<string, any> = {
        name: productUpdate.name,
        description: productUpdate.description,
        price: productUpdate.price,
        old_price: productUpdate.oldPrice,
        category: productUpdate.category,
        images: productUpdate.images,
        featured: productUpdate.featured,
        on_sale: productUpdate.onSale,
        stock: productUpdate.stock,
        rating: productUpdate.rating,
        sku: productUpdate.sku
      };
      
      // Remove undefined fields
      Object.keys(dbUpdate).forEach(key => {
        if (dbUpdate[key] === undefined) {
          delete dbUpdate[key];
        }
      });
      
      console.log("Sending to database:", dbUpdate);
      
      if (Object.keys(dbUpdate).length > 0) {
        const { error } = await supabase
          .from('products')
          .update(dbUpdate)
          .eq('id', id);
        
        if (error) {
          console.error('Error updating product in Supabase:', error);
          toast.warning("Product updated locally but not synced to database");
        } else {
          console.log("Product updated successfully in database");
          toast.success('Product updated successfully');
        }
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };
  
  /**
   * Deletes a product and syncs changes to all storage
   */
  const deleteProduct = async (id: string) => {
    try {
      console.log("Deleting product with ID:", id);
      
      // Update local state and localStorage first for immediate feedback
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      
      // Then, delete from the database
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product from Supabase:', error);
        toast.warning("Product deleted locally but not from database");
      } else {
        toast.success('Product deleted successfully');
        console.log("Product deleted successfully from database");
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };
  
  // Cart operations
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
  
  // Order operations
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
        toast.error('Error updating order status');
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
      toast.error('Error updating order status');
    }
  };
  
  // Contact message operations
  const addContactMessage = async (message: Omit<ContactMessage, 'id' | 'date'>): Promise<void> => {
    try {
      console.log("Adding contact message:", message);
      
      if (!message.name.trim() || !message.email.trim() || !message.message.trim()) {
        throw new Error('Required fields are missing');
      }
      
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: message.name,
          email: message.email,
          subject: message.subject || null,
          message: message.message,
          date: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving contact message:', error);
        throw new Error('Failed to send message');
      }
      
      console.log("Contact message added successfully, data:", data);
      
      if (data) {
        const formattedMessage: ContactMessage = {
          id: data.id,
          name: data.name,
          email: data.email,
          subject: data.subject || '',
          message: data.message,
          date: new Date(data.date).toISOString().split('T')[0]
        };
        
        setContactMessages(prev => [formattedMessage, ...prev]);
      }
      
      fetchContactMessages();
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
        toast.error('Error deleting contact message');
        throw error;
      }
      
      setContactMessages(prev => prev.filter(message => message.id !== messageId));
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting contact message:', error);
      toast.error('Error deleting contact message');
      throw error;
    }
  };
  
  // Admin operations
  const login = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem(STORAGE_KEYS.ADMIN, 'true');
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN);
  };
  
  // Create store context value
  const value: StoreContextType = {
    products,
    featuredProducts,
    saleProducts,
    bestSellingProducts,
    dealsProducts,
    getProductById,
    getProductsByCategory,
    getProductsByPlacement,
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
    logout,
    fetchProducts
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
