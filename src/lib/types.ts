
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: string;
  rating: number;
  stock: number;
  sku: string;
  featured?: boolean;
  onSale?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  productId?: string; // Adding this for backward compatibility
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface CustomerInfo {
  name: string;
  nickname?: string;
  phone: string;
  city: string;
  // Additional fields needed for Checkout.tsx
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  state?: string;
  zipCode?: string;
  paymentMethod?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  customer: CustomerInfo;
  date: string;
  total: number;
  created_at?: string;
  updated_at?: string;
}

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type City = {
  id: string;
  name: string;
};

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  date: string;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
