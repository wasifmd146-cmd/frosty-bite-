import { Product, Coupon, Review } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Obsidian Truffle Cake',
    description: 'Dark chocolate ganache layered with espresso-infused sponge, finished with gold leaf.',
    price: 85,
    category: 'Cakes',
    image: 'https://picsum.photos/seed/cake1/600/600',
    isFeatured: true,
    stock: 12,
    rating: 4.9
  },
  {
    id: '2',
    name: 'Champagne Strawberry Tart',
    description: 'Buttery sable crust filled with champagne pastry cream and fresh organic strawberries.',
    price: 45,
    category: 'Tarts',
    image: 'https://picsum.photos/seed/tart1/600/600',
    isFeatured: true,
    stock: 20,
    rating: 4.7
  },
  {
    id: '3',
    name: 'Salted Caramel Macarons',
    description: 'A box of 12 premium macarons with sea salt caramel filling.',
    price: 32,
    category: 'Macarons',
    image: 'https://picsum.photos/seed/macaron1/600/600',
    isFeatured: false,
    stock: 50,
    rating: 4.8
  },
  {
    id: '4',
    name: 'Velvet Rose Cupcake',
    description: 'Red velvet sponge with rose-water buttercream and crystallized petals.',
    price: 8,
    category: 'Cupcakes',
    image: 'https://picsum.photos/seed/cupcake1/600/600',
    isFeatured: false,
    stock: 100,
    rating: 4.6
  },
  {
    id: '5',
    name: 'Gold Dust Eclair',
    description: 'Choux pastry filled with vanilla bean cream, topped with chocolate glaze and gold dust.',
    price: 12,
    category: 'Pastries',
    image: 'https://picsum.photos/seed/eclair1/600/600',
    isFeatured: true,
    stock: 15,
    rating: 4.9
  },
  {
    id: '6',
    name: 'Midnight Cheesecake',
    description: 'Activated charcoal cheesecake with a blackberry coulis center.',
    price: 65,
    category: 'Cakes',
    image: 'https://picsum.photos/seed/cheese1/600/600',
    isFeatured: false,
    stock: 8,
    rating: 4.8
  }
];

export const MOCK_COUPONS: Coupon[] = [
  { code: 'WELCOME10', discountType: 'percentage', value: 10, minOrderValue: 20 },
  { code: 'LUXURY20', discountType: 'flat', value: 20, minOrderValue: 100 },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'mock-user-1',
    userName: 'Sophie Laurent',
    rating: 5,
    comment: 'Absolutely divine! The truffle texture is unmatched and the gold leaf adds such a luxurious touch.',
    date: '2023-11-15T10:30:00Z'
  },
  {
    id: '2',
    productId: '1',
    userId: 'mock-user-2',
    userName: 'James Bolton',
    rating: 4,
    comment: 'Rich and decadent. Perfect for special occasions, though a bit heavy for dessert after a large meal.',
    date: '2023-11-20T14:15:00Z'
  },
  {
    id: '3',
    productId: '2',
    userId: 'mock-user-3',
    userName: 'Elena R.',
    rating: 5,
    comment: 'The champagne cream is light and airy. Strawberries were incredibly fresh.',
    date: '2023-12-01T09:00:00Z'
  }
];

export const MOCK_REVENUE_DATA = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 6390 },
  { name: 'Sun', value: 7490 },
];