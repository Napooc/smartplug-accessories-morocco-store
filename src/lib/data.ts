
import { Product, Category, City, Order } from './types';

export const categories: Category[] = [
  { id: 'home-kitchen', name: 'Home & Kitchen', icon: 'home' },
  { id: 'electronics', name: 'Electronics', icon: 'headphones' },
  { id: 'tools-lighting', name: 'Tools & Lighting', icon: 'tool' },
  { id: 'plumbing', name: 'Plumbing', icon: 'droplet' },
  { id: 'garden-terrace', name: 'Garden & Terrace', icon: 'flower' },
  { id: 'paint-hardware', name: 'Paint & Hardware', icon: 'paintbrush' },
  { id: 'bathroom-toilet', name: 'Bathroom & Toilet', icon: 'bath' },
  { id: 'heating-ac', name: 'Heating & AC', icon: 'thermometer' }
];

export const products: Product[] = [
  // Home & Kitchen
  {
    id: 'hk-001',
    name: 'Premium Coffee Maker',
    description: 'Brew perfect coffee every time with this high-quality coffee maker. Features programmable settings and a thermal carafe to keep your coffee hot for hours.',
    price: 599,
    oldPrice: 799,
    images: ['https://images.unsplash.com/photo-1622633721122-e0dc9c83e9c6?w=500&auto=format&fit=crop&q=80'],
    category: 'home-kitchen',
    rating: 4.7,
    stock: 35,
    sku: 'HK-CM-001',
    featured: true,
    onSale: true
  },
  {
    id: 'hk-002',
    name: 'Smart Blender Pro',
    description: 'Powerful 1200W blender with smart programs for smoothies, soups, and more. The durable stainless steel blades easily crush ice and frozen ingredients.',
    price: 449,
    images: ['https://images.unsplash.com/photo-1570222094714-d515c3e2d25e?w=500&auto=format&fit=crop&q=80'],
    category: 'home-kitchen',
    rating: 4.5,
    stock: 42,
    sku: 'HK-BL-002'
  },
  {
    id: 'hk-003',
    name: 'Digital Air Fryer',
    description: 'Healthy cooking made easy with this digital air fryer. Cook your favorite meals with little to no oil while maintaining a crispy exterior and tender interior.',
    price: 349,
    oldPrice: 399,
    images: ['https://images.unsplash.com/photo-1612462767153-ad8a7af225a9?w=500&auto=format&fit=crop&q=80'],
    category: 'home-kitchen',
    rating: 4.8,
    stock: 28,
    sku: 'HK-AF-003',
    onSale: true
  },
  
  // Electronics
  {
    id: 'el-001',
    name: 'Premium Wireless Earbuds',
    description: 'High-quality wireless earbuds with active noise cancellation, water resistance, and exceptional sound quality. Up to 24 hours of battery life with the charging case.',
    price: 699,
    oldPrice: 899,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80'],
    category: 'electronics',
    rating: 4.9,
    stock: 45,
    sku: 'EL-WE-001',
    featured: true,
    onSale: true
  },
  {
    id: 'el-002',
    name: 'Portable Bluetooth Speaker',
    description: 'Powerful portable speaker with 360° sound, waterproof design, and 20-hour battery life. Perfect for outdoor adventures or home use.',
    price: 499,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=80'],
    category: 'electronics',
    rating: 4.6,
    stock: 38,
    sku: 'EL-BS-002'
  },
  {
    id: 'el-003',
    name: 'Premium Smart Earbuds',
    description: 'Touch-controlled wireless earbuds with premium sound quality, voice assistant support, and sweat resistance. Perfect for workouts and daily use.',
    price: 549,
    oldPrice: 649,
    images: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?w=500&auto=format&fit=crop&q=80'],
    category: 'electronics',
    rating: 4.7,
    stock: 32,
    sku: 'EL-SE-003',
    onSale: true
  },
  
  // Tools & Lighting
  {
    id: 'tl-001',
    name: 'Professional Power Drill',
    description: 'Heavy-duty cordless drill with lithium-ion battery, variable speed settings, and LED light. Includes a carrying case and multiple drill bits.',
    price: 799,
    oldPrice: 999,
    images: ['https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=500&auto=format&fit=crop&q=80'],
    category: 'tools-lighting',
    rating: 4.8,
    stock: 25,
    sku: 'TL-PD-001',
    featured: true,
    onSale: true
  },
  {
    id: 'tl-002',
    name: 'Smart LED Ceiling Light',
    description: 'Wi-Fi enabled smart ceiling light with adjustable brightness and color temperature. Compatible with popular voice assistants for hands-free control.',
    price: 299,
    images: ['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=500&auto=format&fit=crop&q=80'],
    category: 'tools-lighting',
    rating: 4.5,
    stock: 40,
    sku: 'TL-SL-002'
  },
  {
    id: 'tl-003',
    name: 'Multi-Tool Set',
    description: 'Comprehensive 24-piece multi-tool set with premium quality materials. Perfect for DIY projects and professional use.',
    price: 349,
    oldPrice: 399,
    images: ['https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500&auto=format&fit=crop&q=80'],
    category: 'tools-lighting',
    rating: 4.7,
    stock: 30,
    sku: 'TL-MT-003',
    onSale: true
  },
  
  // Plumbing
  {
    id: 'pl-001',
    name: 'Premium Kitchen Faucet',
    description: 'Stainless steel kitchen faucet with pull-down sprayer and spot-resistant finish. Easy installation and durable construction.',
    price: 399,
    oldPrice: 499,
    images: ['https://images.unsplash.com/photo-1584305574647-0cc949a2bb7f?w=500&auto=format&fit=crop&q=80'],
    category: 'plumbing',
    rating: 4.6,
    stock: 22,
    sku: 'PL-KF-001',
    onSale: true
  },
  {
    id: 'pl-002',
    name: 'Water Filter System',
    description: 'Under-sink water filtration system that removes contaminants for cleaner, better-tasting water. Easy to install and maintain.',
    price: 249,
    images: ['https://images.unsplash.com/photo-1581577124372-9bee15182795?w=500&auto=format&fit=crop&q=80'],
    category: 'plumbing',
    rating: 4.8,
    stock: 35,
    sku: 'PL-WF-002',
    featured: true
  },
  {
    id: 'pl-003',
    name: 'Bathroom Shower Head',
    description: 'High-pressure rainfall shower head with multiple spray settings and easy cleaning nozzles. Simple installation with no tools required.',
    price: 199,
    oldPrice: 249,
    images: ['https://images.unsplash.com/photo-1585511582283-69aae8dbc917?w=500&auto=format&fit=crop&q=80'],
    category: 'plumbing',
    rating: 4.5,
    stock: 50,
    sku: 'PL-SH-003',
    onSale: true
  },
  
  // Garden & Terrace
  {
    id: 'gt-001',
    name: 'Outdoor Furniture Set',
    description: 'Modern 4-piece patio furniture set with weather-resistant wicker and comfortable cushions. Perfect for outdoor entertaining.',
    price: 1299,
    oldPrice: 1599,
    images: ['https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=500&auto=format&fit=crop&q=80'],
    category: 'garden-terrace',
    rating: 4.7,
    stock: 15,
    sku: 'GT-FS-001',
    featured: true,
    onSale: true
  },
  {
    id: 'gt-002',
    name: 'Electric Lawn Mower',
    description: 'Powerful cordless lawn mower with adjustable cutting height and a large grass collection bag. Environmentally friendly and low maintenance.',
    price: 899,
    images: ['https://images.unsplash.com/photo-1589921082969-19851111cfe6?w=500&auto=format&fit=crop&q=80'],
    category: 'garden-terrace',
    rating: 4.6,
    stock: 20,
    sku: 'GT-LM-002'
  },
  {
    id: 'gt-003',
    name: 'Garden Tool Set',
    description: 'Complete 8-piece garden tool set with ergonomic handles and durable stainless steel construction. Includes a convenient storage bag.',
    price: 249,
    oldPrice: 299,
    images: ['https://images.unsplash.com/photo-1585513356945-97cfd7c043ca?w=500&auto=format&fit=crop&q=80'],
    category: 'garden-terrace',
    rating: 4.5,
    stock: 45,
    sku: 'GT-TS-003',
    onSale: true
  },
  
  // Paint & Hardware
  {
    id: 'ph-001',
    name: 'Premium Interior Paint',
    description: 'High-quality low-VOC interior paint with excellent coverage and a smooth finish. Available in a variety of colors and finishes.',
    price: 199,
    oldPrice: 249,
    images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80'],
    category: 'paint-hardware',
    rating: 4.7,
    stock: 60,
    sku: 'PH-IP-001',
    onSale: true
  },
  {
    id: 'ph-002',
    name: 'Hardware Assortment Kit',
    description: 'Comprehensive 1000-piece hardware kit with screws, nails, anchors, and more. Organized in a durable case with labeled compartments.',
    price: 299,
    images: ['https://images.unsplash.com/photo-1621574539437-4e87af011ba1?w=500&auto=format&fit=crop&q=80'],
    category: 'paint-hardware',
    rating: 4.8,
    stock: 40,
    sku: 'PH-HK-002',
    featured: true
  },
  {
    id: 'ph-003',
    name: 'Professional Paint Roller Set',
    description: 'Complete paint roller set with various roller sizes, extension pole, and paint tray. Perfect for both DIY and professional projects.',
    price: 149,
    oldPrice: 179,
    images: ['https://images.unsplash.com/photo-1581091878591-4f0714c6f32f?w=500&auto=format&fit=crop&q=80'],
    category: 'paint-hardware',
    rating: 4.6,
    stock: 55,
    sku: 'PH-PR-003',
    onSale: true
  },
  
  // Bathroom & Toilet
  {
    id: 'bt-001',
    name: 'Modern Bathroom Vanity',
    description: 'Elegant bathroom vanity with ceramic sink, soft-close drawers, and water-resistant finish. Includes pre-drilled faucet holes for easy installation.',
    price: 999,
    oldPrice: 1299,
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80'],
    category: 'bathroom-toilet',
    rating: 4.8,
    stock: 18,
    sku: 'BT-BV-001',
    featured: true,
    onSale: true
  },
  {
    id: 'bt-002',
    name: 'Water-Efficient Toilet',
    description: 'Modern toilet with dual-flush technology for water efficiency. Comfort height design and powerful flushing system for improved performance.',
    price: 599,
    images: ['https://images.unsplash.com/photo-1569597190883-1e1055627cc2?w=500&auto=format&fit=crop&q=80'],
    category: 'bathroom-toilet',
    rating: 4.7,
    stock: 25,
    sku: 'BT-WT-002'
  },
  {
    id: 'bt-003',
    name: 'Luxury Shower System',
    description: 'Complete shower system with rainfall shower head, handheld sprayer, and body jets. Thermostatic valve maintains consistent water temperature.',
    price: 799,
    oldPrice: 999,
    images: ['https://images.unsplash.com/photo-1564540574859-0dfb63985953?w=500&auto=format&fit=crop&q=80'],
    category: 'bathroom-toilet',
    rating: 4.9,
    stock: 15,
    sku: 'BT-SS-003',
    onSale: true
  },
  
  // Heating & Air Conditioning
  {
    id: 'ha-001',
    name: 'Smart Thermostat',
    description: 'Wi-Fi enabled smart thermostat that learns your preferences and optimizes energy usage. Control from anywhere with the mobile app.',
    price: 299,
    oldPrice: 349,
    images: ['https://images.unsplash.com/photo-1585713700486-0b176b128ca1?w=500&auto=format&fit=crop&q=80'],
    category: 'heating-ac',
    rating: 4.8,
    stock: 30,
    sku: 'HA-ST-001',
    featured: true,
    onSale: true
  },
  {
    id: 'ha-002',
    name: 'Portable Air Conditioner',
    description: 'Powerful yet quiet portable air conditioner with multiple cooling modes and dehumidifier function. Easy to move with built-in wheels.',
    price: 699,
    images: ['https://images.unsplash.com/photo-1586158291800-2665f07bba79?w=500&auto=format&fit=crop&q=80'],
    category: 'heating-ac',
    rating: 4.6,
    stock: 20,
    sku: 'HA-AC-002'
  },
  {
    id: 'ha-003',
    name: 'Oil-Filled Radiator Heater',
    description: 'Energy-efficient oil-filled radiator with adjustable thermostat and multiple heat settings. Silent operation and tip-over protection for safety.',
    price: 249,
    oldPrice: 299,
    images: ['https://images.unsplash.com/photo-1643236655169-2c6b33a1b44e?w=500&auto=format&fit=crop&q=80'],
    category: 'heating-ac',
    rating: 4.5,
    stock: 25,
    sku: 'HA-RH-003',
    onSale: true
  }
];

export const cities: City[] = [
  { id: "casablanca", name: "Casablanca" },
  { id: "rabat", name: "Rabat" },
  { id: "marrakech", name: "Marrakech" },
  { id: "agadir", name: "Agadir" },
  { id: "tangier", name: "Tangier" },
  { id: "fez", name: "Fez" },
  { id: "meknes", name: "Meknes" },
  { id: "oujda", name: "Oujda" },
  { id: "kenitra", name: "Kenitra" },
  { id: "tetouan", name: "Tetouan" }
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
