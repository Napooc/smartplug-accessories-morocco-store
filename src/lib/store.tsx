import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CustomerInfo, Order } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface CartItem extends Product {
  quantity: number;
}

interface State {
  cart: CartItem[];
  products: Product[];
  featuredProducts: Product[];
  saleProducts: Product[];
  orders: Order[];
  customerInfo: CustomerInfo | null;
  isAdmin: boolean;
  searchTerm: string;
}

interface Actions {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  setProducts: (products: Product[]) => void;
  setFeaturedProducts: (products: Product[]) => void;
  setSaleProducts: (products: Product[]) => void;
  setOrders: (orders: Order[]) => void;
  updateCustomerInfo: (customerInfo: CustomerInfo) => void;
  clearCustomerInfo: () => void;
  login: () => void;
  logout: () => void;
  addProduct: (product: Product) => Promise<Product | null>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  createOrder: (customerInfo: CustomerInfo) => Promise<Order | null>;
  searchProducts: (term: string) => Product[];
  setSearchTerm: (term: string) => void;
}

const calculateTotal = () => {
  const cart = useStore.getState().cart;
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      cart: [],
      products: [],
      featuredProducts: [],
      saleProducts: [],
      orders: [],
      customerInfo: null,
      isAdmin: false,
      searchTerm: '',
      addToCart: (product) => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.id === product.id);
        
        if (existingItem) {
          const updatedCart = cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
          set({ cart: updatedCart });
          toast.success(`${product.name} quantity updated in cart!`);
        } else {
          const updatedCart = [...cart, { ...product, quantity: 1 }];
          set({ cart: updatedCart });
          toast.success(`${product.name} added to cart!`);
        }
      },
      removeFromCart: (productId) => {
        const cart = get().cart;
        const updatedCart = cart.filter((item) => item.id !== productId);
        set({ cart: updatedCart });
        toast.success('Item removed from cart!');
      },
      increaseQuantity: (productId) => {
        const cart = get().cart;
        const updatedCart = cart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        set({ cart: updatedCart });
      },
      decreaseQuantity: (productId) => {
        const cart = get().cart;
        const updatedCart = cart.map((item) =>
          item.id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        set({ cart: updatedCart });
      },
      clearCart: () => {
        set({ cart: [] });
        toast.success('Cart cleared!');
      },
      setProducts: (products) => {
        set({ products });
      },
      setFeaturedProducts: (products) => {
        set({ featuredProducts: products });
      },
      setSaleProducts: (products) => {
        set({ saleProducts: products });
      },
      setOrders: (orders) => {
        set({ orders });
      },
      updateCustomerInfo: (customerInfo) => {
        set({ customerInfo });
      },
      clearCustomerInfo: () => {
        set({ customerInfo: null });
      },
      login: () => {
        set({ isAdmin: true });
      },
      logout: () => {
        set({ isAdmin: false });
        set({ customerInfo: null });
        set({ cart: [] });
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('my-store');
        toast.success('Logged out successfully!');
      },
      addProduct: async (product: Product): Promise<Product | null> => {
        try {
          const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select()
            .single();
          
          if (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product.');
            return null;
          }
          
          set((state) => ({ products: [...state.products, data] }));
          toast.success(`${product.name} added successfully!`);
          return data;
        } catch (error) {
          console.error('Error adding product:', error);
          toast.error('Failed to add product.');
          return null;
        }
      },
      updateProduct: async (productId: string, updates: Partial<Product>): Promise<void> => {
        try {
          const { error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', productId);
          
          if (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product.');
            return;
          }
          
          set((state) => ({
            products: state.products.map((product) =>
              product.id === productId ? { ...product, ...updates } : product
            ),
          }));
          toast.success('Product updated successfully!');
        } catch (error) {
          console.error('Error updating product:', error);
          toast.error('Failed to update product.');
        }
      },
      deleteProduct: async (productId: string): Promise<void> => {
        try {
          const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);
          
          if (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product.');
            return;
          }
          
          set((state) => ({
            products: state.products.filter((product) => product.id !== productId),
          }));
          toast.success('Product deleted successfully!');
        } catch (error) {
          console.error('Error deleting product:', error);
          toast.error('Failed to delete product.');
        }
      },
      createOrder: async (customerInfo: CustomerInfo): Promise<Order | null> => {
        try {
          const newOrder = {
            customer_info: customerInfo,
            items: get().cart,
            status: 'pending',
            total: calculateTotal(),
            date: new Date().toISOString(),
          };
      
          const { data, error } = await supabase
            .from('orders')
            .insert({
              customer_info: newOrder.customer_info,
              items: newOrder.items,
              status: newOrder.status,
              total: newOrder.total,
              date: newOrder.date
            })
            .select();
      
          if (error) {
            console.error('Error creating order:', error);
            return null;
          }
      
          set({ cart: [] });
          set({ customerInfo: null });
          toast.success('Order created successfully!');
          return data ? data[0] : null;
        } catch (error) {
          console.error('Error creating order:', error);
          return null;
        }
      },
      searchProducts: (term: string) => {
        const products = get().products;
        const searchTerm = term.toLowerCase();
        return products.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      },
      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
      },
    }),
    {
      name: 'my-store',
    }
  )
);
