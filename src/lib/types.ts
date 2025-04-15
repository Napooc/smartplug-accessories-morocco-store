
export interface CartItem {
  product: Product;
  quantity: number;
  selectedColorVariant?: ColorVariant;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  orderNotes?: string;
  // Adding these fields to match the usage in the app
  name?: string;
  nickname?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  customer: CustomerInfo;
  date: string;
  total: number;
}

export interface ColorVariant {
  id: string;
  name: string;
  hexValue: string;
  images: string[];
  priceAdjustment: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  images: string[];
  featured: boolean;
  onSale: boolean;
  stock: number;
  rating: number;
  sku: string;
  placement?: 'best_selling' | 'deals' | 'regular';
  colorVariants?: ColorVariant[];
}

// Adding the missing interfaces
export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface City {
  id: string;
  name: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  date: string;
}
