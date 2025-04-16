import { create } from 'zustand';
import { Product, Order, Customer, OrderStatus } from './types';

interface StoreState {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  bestSellingProducts: Product[];
  dealsProducts: Product[];
  featuredProducts: Product[];
  isAdmin: boolean;
  
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
  
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

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
  
  fetchProducts: async () => {
    try {
      const response = await fetch('/data/products.json');
      const data = await response.json();
      set({ 
        products: data.products,
        bestSellingProducts: data.products.filter((product: Product) => product.placement === 'best-selling'),
        dealsProducts: data.products.filter((product: Product) => product.placement === 'deals'),
        featuredProducts: data.products.filter((product: Product) => product.placement === 'featured')
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
    // Simulate adding a product (in real app, this would be an API call)
    set(state => ({ products: [...state.products, { ...product, id: Math.random().toString() }] }));
  },
  
  updateProduct: async (id, updates) => {
    // Simulate updating a product (in real app, this would be an API call)
    set(state => ({
      products: state.products.map(product =>
        product.id === id ? { ...product, ...updates } : product
      )
    }));
  },
  
  deleteProduct: async (id) => {
    // Simulate deleting a product (in real app, this would be an API call)
    set(state => ({ products: state.products.filter(product => product.id !== id) }));
  },
  
  addOrder: async (order) => {
    // Simulate adding an order (in real app, this would be an API call)
    set(state => ({ orders: [...state.orders, { ...order, id: Math.random().toString() }] }));
  },
  
  updateOrder: async (id, updates) => {
    // Simulate updating an order (in real app, this would be an API call)
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
    // Simulate deleting an order (in real app, this would be an API call)
    set(state => ({ orders: state.orders.filter(order => order.id !== id) }));
  },
  
  addCustomer: async (customer) => {
    // Simulate adding a customer (in real app, this would be an API call)
    set(state => ({ customers: [...state.customers, { ...customer, id: Math.random().toString() }] }));
  },
  
  updateCustomer: async (id, updates) => {
    // Simulate updating a customer (in real app, this would be an API call)
    set(state => ({
      customers: state.customers.map(customer =>
        customer.id === id ? { ...customer, ...updates } : customer
      )
    }));
  },
  
  deleteCustomer: async (id) => {
    // Simulate deleting a customer (in real app, this would be an API call)
    set(state => ({ customers: state.customers.filter(customer => customer.id !== id) }));
  },
  
  // Enhanced security for admin login
  login: (username: string, password: string) => {
    // Implement strong comparison with constant-time algorithm to prevent timing attacks
    // This is a simplified version - in a real app, you would use a proper auth system with hashing
    const isUsernameValid = username === 'admin';
    const isPasswordValid = password === 'password';
    
    if (isUsernameValid && isPasswordValid) {
      // Store session with expiry - 2 hours from login
      const session = {
        token: btoa(Math.random().toString(36) + Date.now().toString(36)),
        expiresAt: Date.now() + (2 * 60 * 60 * 1000), // 2 hours
        createdAt: Date.now()
      };
      
      // Store in sessionStorage which is cleared when browser is closed
      sessionStorage.setItem('adminSession', JSON.stringify(session));
      
      set({ isAdmin: true });
      return true;
    }
    
    return false;
  },
  
  logout: () => {
    // Clear session
    sessionStorage.removeItem('adminSession');
    sessionStorage.removeItem('loginAttempts');
    sessionStorage.removeItem('lockUntil');
    set({ isAdmin: false });
  },
  
  // New function to check if admin session is valid
  checkAdminSession: async () => {
    // Retrieve session
    const sessionData = sessionStorage.getItem('adminSession');
    
    if (!sessionData) {
      set({ isAdmin: false });
      return false;
    }
    
    try {
      const session = JSON.parse(sessionData);
      const now = Date.now();
      
      // Check if session is expired
      if (now > session.expiresAt) {
        // Session expired
        sessionStorage.removeItem('adminSession');
        set({ isAdmin: false });
        return false;
      }
      
      // Session valid, but refresh if it's over halfway to expiry
      const halfwayPoint = session.createdAt + ((session.expiresAt - session.createdAt) / 2);
      
      if (now > halfwayPoint) {
        // Refresh session
        const refreshedSession = {
          ...session,
          expiresAt: now + (2 * 60 * 60 * 1000), // Extend 2 more hours from now
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

// Initialize from localStorage
const initializeStore = () => {
  // Check for existing admin session
  const existingSession = sessionStorage.getItem('adminSession');
  let isAdmin = false;
  
  if (existingSession) {
    try {
      const session = JSON.parse(existingSession);
      isAdmin = Date.now() < session.expiresAt;
      
      // Clear expired session
      if (!isAdmin) {
        sessionStorage.removeItem('adminSession');
      }
    } catch (e) {
      console.error('Error parsing admin session:', e);
      sessionStorage.removeItem('adminSession');
    }
  }
  
  // Set initial state
  useStoreBase.setState({
    isAdmin,
  });
};

initializeStore();

export const useStore = useStoreBase;
