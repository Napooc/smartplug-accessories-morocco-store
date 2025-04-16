import { create } from 'zustand';
import { Product, Order, OrderStatus, CustomerInfo, CartItem } from './types';

interface StoreState {
  products: Product[];
  orders: Order[];
  customers: CustomerInfo[];
  bestSellingProducts: Product[];
  dealsProducts: Product[];
  featuredProducts: Product[];
  isAdmin: boolean;
  cart: CartItem[];
  cartTotal: number;
  
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchCustomers: () => Promise<void>;
  
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  
  addCustomer: (customer: Omit<CustomerInfo, 'id'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<CustomerInfo>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  placeOrder: (customerInfo: CustomerInfo) => Promise<Order | null>;

  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getProductsByPlacement: (placement: string) => Product[];
  
  login: (username: string, password: string) => boolean;
  logout: () => void;
  checkAdminSession: () => Promise<boolean>;
}

const useStoreBase = create<StoreState>((set, get) => ({
  products: [],
  orders: [],
  customers: [],
  bestSellingProducts: [],
  dealsProducts: [],
  featuredProducts: [],
  isAdmin: false,
  cart: [],
  cartTotal: 0,
  
  fetchProducts: async () => {
    try {
      const response = await fetch('/data/products.json');
      const data = await response.json();
      set({ 
        products: data.products,
        bestSellingProducts: data.products.filter((product: Product) => product.placement === 'best_selling'),
        dealsProducts: data.products.filter((product: Product) => product.placement === 'deals'),
        featuredProducts: data.products.filter((product: Product) => product.featured)
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  },
  
  fetchOrders: async () => {
    try {
      const response = await fetch('/data/orders.json');
      const data = await response.json();
      set({ orders: data.orders });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  },
  
  fetchCustomers: async () => {
    try {
      const response = await fetch('/data/customers.json');
      const data = await response.json();
      set({ customers: data.customers });
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  },
  
  addProduct: async (product) => {
    set(state => ({ products: [...state.products, { ...product, id: Math.random().toString() }] }));
  },
  
  updateProduct: async (id, updates) => {
    set(state => ({
      products: state.products.map(product =>
        product.id === id ? { ...product, ...updates } : product
      )
    }));
  },
  
  deleteProduct: async (id) => {
    set(state => ({ products: state.products.filter(product => product.id !== id) }));
  },
  
  addOrder: async (order) => {
    set(state => ({ orders: [...state.orders, { ...order, id: Math.random().toString() }] }));
  },
  
  updateOrder: async (id, updates) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === id ? { ...order, ...updates } : order
      )
    }));
  },
  
  updateOrderStatus: async (id: string, status: OrderStatus) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === id ? { ...order, status: status } : order
      )
    }));
  },
  
  deleteOrder: async (id) => {
    set(state => ({ orders: state.orders.filter(order => order.id !== id) }));
  },
  
  addCustomer: async (customer) => {
    set(state => ({ customers: [...state.customers, { ...customer, id: Math.random().toString() }] }));
  },
  
  updateCustomer: async (id, updates) => {
    set(state => ({
      customers: state.customers.map(customer =>
        customer.id === id ? { ...customer, ...updates } : customer
      )
    }));
  },
  
  deleteCustomer: async (id) => {
    set(state => ({ customers: state.customers.filter(customer => customer.id !== id) }));
  },
  
  addToCart: (product, quantity = 1) => {
    set(state => {
      const existingItemIndex = state.cart.findIndex(item => item.product.id === product.id);
      let newCart = [...state.cart];
      
      if (existingItemIndex >= 0) {
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + quantity
        };
      } else {
        newCart.push({
          product,
          quantity
        });
      }
      
      const newTotal = newCart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      
      return {
        cart: newCart,
        cartTotal: newTotal
      };
    });
  },
  
  removeFromCart: (productId) => {
    set(state => {
      const newCart = state.cart.filter(item => item.product.id !== productId);
      const newTotal = newCart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      
      return {
        cart: newCart,
        cartTotal: newTotal
      };
    });
  },
  
  updateCartItemQuantity: (productId, quantity) => {
    set(state => {
      if (quantity <= 0) {
        return state;
      }
      
      const newCart = state.cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      );
      
      const newTotal = newCart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      
      return {
        cart: newCart,
        cartTotal: newTotal
      };
    });
  },
  
  clearCart: () => {
    set({ cart: [], cartTotal: 0 });
  },
  
  getProductById: (id) => {
    return get().products.find(product => product.id === id);
  },
  
  getProductsByCategory: (category) => {
    return get().products.filter(product => product.category === category);
  },
  
  getProductsByPlacement: (placement) => {
    return get().products.filter(product => product.placement === placement);
  },
  
  placeOrder: async (customerInfo) => {
    const { cart, cartTotal } = get();
    
    if (cart.length === 0) {
      console.error("Cannot place empty order");
      return null;
    }
    
    const newOrder: Order = {
      id: Math.random().toString(),
      items: [...cart],
      status: 'pending',
      customer: customerInfo,
      date: new Date().toISOString(),
      total: cartTotal
    };
    
    try {
      await get().addOrder(newOrder);
      return newOrder;
    } catch (error) {
      console.error("Failed to place order:", error);
      return null;
    }
  },
  
  login: (username: string, password: string) => {
    const isUsernameValid = username === 'admin';
    const isPasswordValid = password === 'password';
    
    if (isUsernameValid && isPasswordValid) {
      const session = {
        token: btoa(Math.random().toString(36) + Date.now().toString(36)),
        expiresAt: Date.now() + (2 * 60 * 60 * 1000),
        createdAt: Date.now()
      };
      
      sessionStorage.setItem('adminSession', JSON.stringify(session));
      
      set({ isAdmin: true });
      return true;
    }
    
    return false;
  },
  
  logout: () => {
    sessionStorage.removeItem('adminSession');
    sessionStorage.removeItem('loginAttempts');
    sessionStorage.removeItem('lockUntil');
    set({ isAdmin: false });
  },
  
  checkAdminSession: async () => {
    const sessionData = sessionStorage.getItem('adminSession');
    
    if (!sessionData) {
      set({ isAdmin: false });
      return false;
    }
    
    try {
      const session = JSON.parse(sessionData);
      const now = Date.now();
      
      if (now > session.expiresAt) {
        sessionStorage.removeItem('adminSession');
        set({ isAdmin: false });
        return false;
      }
      
      const halfwayPoint = session.createdAt + ((session.expiresAt - session.createdAt) / 2);
      
      if (now > halfwayPoint) {
        const refreshedSession = {
          ...session,
          expiresAt: now + (2 * 60 * 60 * 1000),
        };
        sessionStorage.setItem('adminSession', JSON.stringify(refreshedSession));
      }
      
      return true;
    } catch (error) {
      console.error('Invalid session format:', error);
      sessionStorage.removeItem('adminSession');
      set({ isAdmin: false });
      return false;
    }
  },
}));

const initializeStore = () => {
  const existingSession = sessionStorage.getItem('adminSession');
  let isAdmin = false;
  
  if (existingSession) {
    try {
      const session = JSON.parse(existingSession);
      isAdmin = Date.now() < session.expiresAt;
      
      if (!isAdmin) {
        sessionStorage.removeItem('adminSession');
      }
    } catch (e) {
      console.error('Error parsing admin session:', e);
      sessionStorage.removeItem('adminSession');
    }
  }
  
  useStoreBase.setState({
    isAdmin,
  });
};

initializeStore();

export const useStore = useStoreBase;
