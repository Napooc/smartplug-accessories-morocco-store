export interface CartItem {
  product: Product;
  quantity: number;
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
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}
