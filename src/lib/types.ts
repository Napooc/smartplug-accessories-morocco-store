
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
  placement?: 'best_selling' | 'deals' | 'regular';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface CustomerInfo {
  name: string;
  nickname?: string;
  phone: string;
  city: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  customer: CustomerInfo;
  date: string;
  total: number;
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
