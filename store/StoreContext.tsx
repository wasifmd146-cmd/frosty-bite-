import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem, User, UserRole, Order, Coupon, StoreSettings, Review } from '../types';
import { MOCK_PRODUCTS, MOCK_COUPONS, MOCK_REVIEWS } from '../lib/constants';
import { supabase } from '../lib/supabaseClient';

interface StoreContextType {
  user: User | null;
  users: User[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  settings: StoreSettings;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string) => number;
  placeOrder: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  updateStoreSettings: (updates: Partial<StoreSettings>) => void;
  addReview: (productId: string, rating: number, comment: string) => void;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Frosty Bite',
    currency: 'USD',
    taxRate: 0.08,
    maintenanceMode: false,
    emailNotifications: true
  });

  const isInitialized = useRef(false);

  // Helper to map Supabase user to our App User
  const mapSupabaseUser = (sbUser: any): User => {
    const isAdmin = sbUser.email === 'wasifmd146@gmail.com' || sbUser.email?.includes('admin');
    
    return {
      id: sbUser.id,
      name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User',
      email: sbUser.email || '',
      role: isAdmin ? UserRole.ADMIN : UserRole.USER,
      avatar: `https://ui-avatars.com/api/?name=${(sbUser.user_metadata?.full_name || 'User').replace(' ', '+')}&background=1A1A1A&color=D4AF37`,
      joined: sbUser.created_at ? sbUser.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
    };
  };

  const updateProductRatings = (currentReviews: Review[]) => {
    setProducts(prevProducts => prevProducts.map(product => {
      const productReviews = currentReviews.filter(r => r.productId === product.id);
      if (productReviews.length === 0) return product;
      
      const avgRating = productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;
      const roundedRating = Math.round(avgRating * 10) / 10;
      
      return { ...product, rating: roundedRating };
    }));
  };

  // Initialize Data
  useEffect(() => {
    const loadData = async () => {
      // 1. Auth Check
      const localAdmin = localStorage.getItem('frosty_local_admin');
      if (localAdmin) {
         setUser({
          id: 'admin-local',
          name: 'Administrator',
          email: 'admin',
          role: UserRole.ADMIN,
          avatar: 'https://ui-avatars.com/api/?name=Admin&background=D4AF37&color=fff',
          joined: new Date().toISOString()
         });
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        }
      }

      // 2. Load Local Data
      const storedSettings = localStorage.getItem('frosty_settings');
      if (storedSettings) setSettings(JSON.parse(storedSettings));

      const storedCoupons = localStorage.getItem('frosty_coupons');
      if (storedCoupons) setCoupons(JSON.parse(storedCoupons));

      const storedReviews = localStorage.getItem('frosty_reviews');
      if (storedReviews) {
        const parsedReviews = JSON.parse(storedReviews);
        setReviews(parsedReviews);
        updateProductRatings(parsedReviews);
      } else {
        updateProductRatings(MOCK_REVIEWS);
      }

      const storedOrders = localStorage.getItem('frosty_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        const mockOrders: Order[] = [
          {
            id: 'ord-123',
            userId: 'admin-01',
            items: [{ ...MOCK_PRODUCTS[0], quantity: 1 }],
            total: 85,
            status: 'completed',
            date: new Date(Date.now() - 86400000 * 2).toISOString()
          },
          {
            id: 'ord-124',
            userId: 'admin-01',
            items: [{ ...MOCK_PRODUCTS[1], quantity: 1 }, { ...MOCK_PRODUCTS[2], quantity: 1 }],
            total: 77,
            status: 'processing',
            date: new Date(Date.now() - 3600000 * 5).toISOString()
          }
        ];
        setOrders(mockOrders);
      }

      const storedUsers = localStorage.getItem('frosty_users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }

      // Mark initialization as complete so effects can start saving
      isInitialized.current = true;
    };

    loadData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!localStorage.getItem('frosty_local_admin')) {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Persist Data Changes (Only after initialization)
  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem('frosty_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem('frosty_settings', JSON.stringify(settings));
    }
  }, [settings]);

  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem('frosty_coupons', JSON.stringify(coupons));
    }
  }, [coupons]);

  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem('frosty_reviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem('frosty_users', JSON.stringify(users));
    }
  }, [users]);

  // --- Auth Methods ---

  const login = async (email: string, password: string): Promise<void> => {
    if (email === 'admin' && password === 'admin123') {
       const adminUser: User = {
        id: 'admin-local',
        name: 'Administrator',
        email: 'admin',
        role: UserRole.ADMIN,
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=D4AF37&color=fff',
        joined: new Date().toISOString()
       };
       setUser(adminUser);
       localStorage.setItem('frosty_local_admin', 'true');
       return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    if (localStorage.getItem('frosty_local_admin')) {
        localStorage.removeItem('frosty_local_admin');
        setUser(null);
    } else {
        await supabase.auth.signOut();
        setUser(null);
    }
  };

  // --- Data Methods ---

  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const applyCoupon = (code: string): number => {
    const coupon = coupons.find(c => c.code === code);
    if (!coupon) return 0;
    if (cartTotal < coupon.minOrderValue) return 0;
    
    if (coupon.expiryDate) {
      const [year, month, day] = coupon.expiryDate.split('-').map(Number);
      const expiry = new Date(year, month - 1, day); 
      expiry.setHours(23, 59, 59, 999);
      if (new Date() > expiry) return 0;
    }

    if (coupon.discountType === 'percentage') {
      return (cartTotal * coupon.value) / 100;
    }
    return coupon.value;
  };

  const placeOrder = () => {
    if (!user) return;
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      items: [...cart],
      total: cartTotal,
      status: 'pending',
      date: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [...prev, coupon]);
  };

  const deleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
  };

  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const addReview = (productId: string, rating: number, comment: string) => {
    if (!user) return;

    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    updateProductRatings(updatedReviews);
  };

  return (
    <StoreContext.Provider value={{
      user,
      users,
      products,
      cart,
      orders,
      coupons,
      reviews,
      settings,
      login,
      signup,
      logout,
      updateUserProfile,
      deleteUser,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      applyCoupon,
      placeOrder,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      deleteOrder,
      addCoupon,
      deleteCoupon,
      updateStoreSettings,
      addReview,
      cartTotal
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};