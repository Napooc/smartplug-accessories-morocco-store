
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, CustomerInfo, Product, Order, OrderStatus } from './types';
import { products, mockOrders } from './data';
import { toast } from 'sonner';

interface StoreContextType {
  // Products
  products: Product[];
  featuredProducts: Product[];
  saleProducts: Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  
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
  placeOrder: () => void;
  
  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Admin
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isAdmin, setIsAdmin] = useState(false);
  
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
    if (!customerInfo || cart.length === 0) return;
    
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
