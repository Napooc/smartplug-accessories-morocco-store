import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { CartItem, CustomerInfo, Product, Order, OrderStatus, ContactMessage, ColorVariant } from './types';
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
  addToCart: (product: Product, quantity?: number, colorVariant?: ColorVariant) => void;
  removeFromCart: (productId: string, colorVariantId?: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number, colorVariantId?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  
  // Checkout
  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;
  placeOrder: (customerData: CustomerInfo) => Promise<Order | undefined>;
  
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
  
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }

    const adminLoggedIn = localStorage.getItem(STORAGE_KEYS.ADMIN);
    if (adminLoggedIn === 'true') {
      setIsAdmin(true);
    }

    Promise.all([
      fetchProducts(),
      fetchOrders(),
      fetchContactMessages()
    ]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from Supabase...');
      
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
      
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error('Error fetching products from Supabase:', error);
        toast.error("Error loading products from database");
        
        if (localProducts.length === 0 && localProductsJson) {
          try {
            const parsedProducts = JSON.parse(localProductsJson);
            setProducts(parsedProducts);
            return;
          } catch (parseError) {
            console.error('Error parsing local products:', parseError);
          }
        }
        
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
          
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(formattedProducts));
        } else {
          console.log('No products found in DB, initializing with sample data');
          
          if (localProducts.length > 0) {
            await syncLocalProductsToSupabase(localProducts);
          } else {
            const productsWithUUIDs = initialProducts.map(product => ({
              ...product,
              id: uuidv4()
            }));
            
            setProducts(productsWithUUIDs);
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsWithUUIDs));
            
            await syncLocalProductsToSupabase(productsWithUUIDs);
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      toast.error("Error loading products");
      
      const localProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (localProducts) {
        try {
          const parsedProducts = JSON.parse(localProducts);
          setProducts(parsedProducts);
        } catch (parseError) {
          console.error('Error parsing local products:', parseError);
          
          const productsWithUUIDs = initialProducts.map(product => ({
            ...product,
            id: uuidv4()
          }));
          
          setProducts(productsWithUUIDs);
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsWithUUIDs));
        }
      } else {
        const productsWithUUIDs = initialProducts.map(product => ({
          ...product,
          id: uuidv4()
        }));
        
        setProducts(productsWithUUIDs);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsWithUUIDs));
      }
    }
  };

  const syncLocalProductsToSupabase = async (localProducts: Product[]) => {
    try {
      for (const product of localProducts) {
        const colorVariantsJson = product.colorVariants ? JSON.stringify(product.colorVariants) : null;
        
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
            sku: product.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
            color_variants: colorVariantsJson
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
  
  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProductId = uuidv4();
      
      const colorVariants = product.colorVariants?.map(variant => ({
        ...variant,
        id: variant.id || uuidv4()
      }));
      
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
        sku: product.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
        colorVariants: colorVariants
      };
      
      console.log('Adding new product:', newProduct);
      
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      
      const colorVariantsJson = colorVariants ? JSON.stringify(colorVariants) : null;
      
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
          sku: newProduct.sku,
          color_variants: colorVariantsJson
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
  
  const updateProduct = async (id: string, productUpdate: Partial<Product>) => {
    try {
      console.log("Updating product with ID:", id);
      console.log("Update data:", productUpdate);
      
      let colorVariants = productUpdate.colorVariants;
      if (colorVariants) {
        colorVariants = colorVariants.map(variant => ({
          ...variant,
          id: variant.id || uuidv4()
        }));
      }
      
      const updatedProducts = products.map(product => 
        product.id === id ? { 
          ...product, 
          ...productUpdate,
          colorVariants: colorVariants || product.colorVariants 
        } : product
      );
      
      setProducts(updatedProducts);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      
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
        sku: productUpdate.sku,
        placement: productUpdate.placement,
        color_variants: colorVariants ? JSON.stringify(colorVariants) : undefined
      };
      
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
  
  const deleteProduct = async (id: string) => {
    try {
      console.log("Deleting product with ID:", id);
      
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product from Supababase:', error);
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
  
  const addToCart = (product: Product, quantity: number = 1, colorVariant?: ColorVariant) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => 
        item.product.id === product.id && 
        (!colorVariant || item.selectedColorVariant?.id === colorVariant.id)
      );
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        return [...prevCart, { 
          product, 
          quantity, 
          selectedColorVariant: colorVariant 
        }];
      }
    });
    
    const colorInfo = colorVariant ? ` - ${colorVariant.name}` : '';
    toast.success(`${product.name}${colorInfo} added to cart`);
  };
  
  const removeFromCart = (productId: string, colorVariantId?: string) => {
    setCart(prevCart => prevCart.filter(item => 
      item.product.id !== productId || 
      (colorVariantId && item.selectedColorVariant?.id !== colorVariantId)
    ));
    
    toast.info("Item removed from cart");
  };
  
  const updateCartItemQuantity = (productId: string, quantity: number, colorVariantId?: string) => {
    if (quantity < 1) return;
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId && 
        (!colorVariantId || item.selectedColorVariant?.id === colorVariantId)
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
  
  const placeOrder = async (customerData: CustomerInfo): Promise<Order | undefined> => {
    try {
      if (!customerData || !customerData.name || !customerData.phone || !customerData.city) {
        console.error("Cannot place order: missing customer info", customerData);
        throw new Error("Complete customer information is required");
      }
      
      if (cart.length === 0) {
        console.error("Cannot place order: empty cart");
        throw new Error("Your cart is empty");
      }
      
      console.log("Placing order with customer info:", customerData);
      console.log("Cart items to be ordered:", cart);
      console.log("Order total:", cartTotal);
      
      setCustomerInfo(customerData);
      
      const orderId = uuidv4();
      
      const newOrder: Order = {
        id: orderId,
        items: [...cart],
        status: 'pending' as OrderStatus,
        customer: { ...customerData },
        date: new Date().toISOString().split('T')[0],
        total: cartTotal
      };
      
      console.log("Created new order object:", newOrder);
      
      const customerInfoJson = JSON.parse(JSON.stringify(customerData));
      const cartItemsJson = JSON.parse(JSON.stringify(cart));
      
      const orderData = {
        id: orderId,
        customer_info: customerInfoJson,
        items: cartItemsJson,
        status: 'pending',
        total: cartTotal,
        date: new Date().toISOString()
      };
      
      console.log("Sending order data to Supabase:", orderData);
      
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error saving order to Supabase:', error);
        throw new Error(`Failed to save order: ${error.message}`);
      }
      
      if (!data) {
        console.error('No data returned from Supabase after order insertion');
        throw new Error('Empty response from server');
      }
      
      console.log('Order saved successfully to Supabase:', data);
      
      setOrders(prevOrders => [...prevOrders, newOrder]);
      
      return newOrder;
    } catch (error) {
      console.error('Error in placeOrder function:', error);
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
