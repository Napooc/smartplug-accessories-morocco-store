import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, CustomerInfo, Product, Order, OrderStatus, ContactMessage } from './types';
import { products as initialProducts, mockOrders } from './data';
import { toast } from 'sonner';

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
  placeOrder: () => Order | undefined;
  
  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Contact
  contactMessages: ContactMessage[];
  addContactMessage: (message: Omit<ContactMessage, 'id' | 'date'>) => void;

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
  
  // Load cart from localStorage on initial load
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
    
    // Check if admin is logged in
    const adminLoggedIn = localStorage.getItem('smartplug-admin');
    if (adminLoggedIn === 'true') {
      setIsAdmin(true);
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('smartplug-cart', JSON.stringify(cart));
  }, [cart]);
  
  // Computed values
  const featuredProducts = products.filter(product => product.featured);
  const saleProducts = products.filter(product => product.onSale);
  
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  );
  
  // Product functions
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
  
  const deleteProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    toast.success('Product deleted successfully');
  };
  
  // Cart functions
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
  
  // Order functions
  const placeOrder = () => {
    if (!customerInfo || cart.length === 0) return undefined;
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 1000)}`,
      items: [...cart],
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
  };
  
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status }
          : order
      )
    );
    
    toast.success(`Order ${orderId} updated to ${status}`);
  };
  
  // Contact message functions
  const addContactMessage = (message: Omit<ContactMessage, 'id' | 'date'>) => {
    const newMessage: ContactMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    
    setContactMessages(prev => [newMessage, ...prev]);
  };
  
  // Admin functions
  const login = (username: string, password: string) => {
    // In a real app, this would be a proper authentication system
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
