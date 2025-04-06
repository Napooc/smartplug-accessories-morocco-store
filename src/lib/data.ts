import { Product, Category, City, Order } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation and long battery life. Perfect for music lovers and calls on the go.',
    price: 249,
    oldPrice: 299,
    images: ['/public/lovable-uploads/c4ef3adc-3f74-445b-aa83-7a85b48c199a.png'],
    category: 'earbuds',
    rating: 4.5,
    stock: 50,
    sku: 'EAR-WL-001',
    featured: true,
    onSale: true
  },
  {
    id: '2',
    name: 'Fast Charger',
    description: 'Super fast 20W USB-C charger for all your devices. Charges your phone up to 50% in just 30 minutes.',
    price: 149,
    images: ['/public/lovable-uploads/563a1834-b7fa-40eb-8a01-96162ae40d11.png'],
    category: 'chargers',
    rating: 4.8,
    stock: 100,
    sku: 'CHG-FC-002'
  },
  {
    id: '3',
    name: 'Premium Headphones',
    description: 'Over-ear premium headphones with studio-quality sound. Comfortable ear cups for extended listening sessions.',
    price: 599,
    oldPrice: 699,
    images: ['/public/lovable-uploads/630c44e5-1c0c-4664-8ac2-18390ad254fb.png'],
    category: 'headphones',
    rating: 4.9,
    stock: 25,
    sku: 'HP-PRE-003',
    featured: true,
    onSale: true
  },
  {
    id: '4',
    name: 'Phone Case',
    description: 'Durable and stylish phone case that provides excellent protection against drops and scratches.',
    price: 99,
    images: ['/public/lovable-uploads/ecb99c13-9a14-4f7f-bc95-dcfdc537faa5.png'],
    category: 'cases',
    rating: 4.3,
    stock: 200,
    sku: 'CASE-001'
  },
  {
    id: '5',
    name: 'USB-C Cable',
    description: 'Premium braided USB-C cable that is durable and supports fast charging and data transfer.',
    price: 79,
    oldPrice: 99,
    images: ['/public/lovable-uploads/ecb99c13-9a14-4f7f-bc95-dcfdc537faa5.png'],
    category: 'cables',
    rating: 4.6,
    stock: 150,
    sku: 'CBL-USBC-005',
    onSale: true
  },
  {
    id: '6',
    name: 'Wireless Charger',
    description: 'Sleek wireless charging pad compatible with all Qi-enabled devices. Charges your phone without the hassle of cables.',
    price: 199,
    images: ['/public/lovable-uploads/563a1834-b7fa-40eb-8a01-96162ae40d11.png'],
    category: 'chargers',
    rating: 4.7,
    stock: 75,
    sku: 'CHG-WL-006',
    featured: true
  },
  {
    id: '7',
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with deep bass and crystal-clear sound. Perfect for indoor and outdoor use.',
    price: 349,
    oldPrice: 399,
    images: ['/public/lovable-uploads/c4ef3adc-3f74-445b-aa83-7a85b48c199a.png'],
    category: 'speakers',
    rating: 4.4,
    stock: 40,
    sku: 'SPK-BT-007',
    onSale: true
  },
  {
    id: '8',
    name: 'Screen Protector',
    description: 'Tempered glass screen protector that provides excellent protection against scratches and impacts.',
    price: 49,
    images: ['/public/lovable-uploads/ecb99c13-9a14-4f7f-bc95-dcfdc537faa5.png'],
    category: 'accessories',
    rating: 4.2,
    stock: 300,
    sku: 'SCRN-PRO-008'
  }
];

export const categories: Category[] = [
  { id: 'earbuds', name: 'Earbuds', icon: 'headphones' },
  { id: 'chargers', name: 'Chargers', icon: 'battery-charging' },
  { id: 'cases', name: 'Phone Cases', icon: 'smartphone' },
  { id: 'cables', name: 'Cables', icon: 'cable' },
  { id: 'headphones', name: 'Headphones', icon: 'headphones' },
  { id: 'speakers', name: 'Speakers', icon: 'speaker' },
  { id: 'accessories', name: 'Accessories', icon: 'plug' }
];

export const cities: City[] = [
  { id: 'casa', name: 'Casablanca' },
  { id: 'rabat', name: 'Rabat' },
  { id: 'marrakech', name: 'Marrakech' },
  { id: 'fes', name: 'Fès' },
  { id: 'tangier', name: 'Tanger' },
  { id: 'agadir', name: 'Agadir' },
  { id: 'meknes', name: 'Meknès' },
  { id: 'oujda', name: 'Oujda' },
  { id: 'kenitra', name: 'Kénitra' },
  { id: 'tetouan', name: 'Tétouan' },
  { id: 'safi', name: 'Safi' },
  { id: 'mohammedia', name: 'Mohammedia' },
  { id: 'eljadida', name: 'El Jadida' },
  { id: 'beniMellal', name: 'Béni Mellal' },
  { id: 'taza', name: 'Taza' },
  { id: 'khemisset', name: 'Khémisset' },
  { id: 'taroudant', name: 'Taroudant' },
  { id: 'essaouira', name: 'Essaouira' },
  { id: 'nador', name: 'Nador' },
  { id: 'khouribga', name: 'Khouribga' },
  { id: 'ouarzazate', name: 'Ouarzazate' },
  { id: 'settat', name: 'Settat' },
  { id: 'berrechid', name: 'Berrechid' },
  { id: 'larache', name: 'Larache' },
  { id: 'khenifra', name: 'Khénifra' }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      { product: products[0], quantity: 2 },
      { product: products[3], quantity: 1 }
    ],
    status: 'pending',
    customer: {
      name: 'Mohammed Ali',
      phone: '0612345678',
      city: 'Casablanca'
    },
    date: '2023-09-15',
    total: products[0].price * 2 + products[3].price
  },
  {
    id: 'ORD-002',
    items: [
      { product: products[2], quantity: 1 }
    ],
    status: 'shipped',
    customer: {
      name: 'Fatima Zahra',
      nickname: 'Fati',
      phone: '0623456789',
      city: 'Rabat'
    },
    date: '2023-09-12',
    total: products[2].price
  },
  {
    id: 'ORD-003',
    items: [
      { product: products[1], quantity: 3 },
      { product: products[4], quantity: 2 }
    ],
    status: 'delivered',
    customer: {
      name: 'Youssef El Mansouri',
      phone: '0634567890',
      city: 'Marrakech'
    },
    date: '2023-09-08',
    total: products[1].price * 3 + products[4].price * 2
  },
];
