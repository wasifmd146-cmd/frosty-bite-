import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/public/Home';
import { Shop } from './pages/public/Shop';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Cart } from './pages/public/Cart';
import { ProductDetails } from './pages/public/ProductDetails';
import { UserDashboard } from './pages/user/UserDashboard';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ProductManagement } from './pages/admin/ProductManagement';
import { OrderManagement } from './pages/admin/OrderManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { CouponManagement } from './pages/admin/CouponManagement';
import { Settings } from './pages/admin/Settings';
import { StoreProvider } from './store/StoreContext';
import { Instagram, Twitter, Facebook, Check } from 'lucide-react';

// Helper to conditionally render Navbar/Footer
const LayoutWrapper = ({ children }: React.PropsWithChildren<{}>) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
  
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen text-neutral-200 font-sans selection:bg-gold-500/30 selection:text-gold-200">
      {!isAdminRoute && !isAuthRoute && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && !isAuthRoute && (
        <footer className="bg-charcoal-950 border-t border-white/5 pt-16 pb-8 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-2xl font-serif font-bold text-white mb-6">
                Frosty<span className="text-gold-500">Bite</span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                Premium artisanal bakery SaaS platform delivering luxury desserts and experiences directly to your doorstep.
              </p>
              <div className="flex gap-4">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-gold-500 hover:text-charcoal-900 transition-all">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-serif mb-6">Shop</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><a href="#/shop" className="hover:text-gold-500 transition-colors">All Products</a></li>
                <li><a href="#/shop" className="hover:text-gold-500 transition-colors">Best Sellers</a></li>
                <li><a href="#/shop" className="hover:text-gold-500 transition-colors">New Arrivals</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-serif mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><a href="#" className="hover:text-gold-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-gold-500 transition-colors">About Frosty Bite</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-serif mb-6">Newsletter</h4>
              <p className="text-neutral-500 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
              {subscribed ? (
                <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded text-sm flex items-center gap-2">
                   <Check size={16} /> Subscribed successfully!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded px-4 py-2 text-sm text-white w-full focus:border-gold-500 outline-none" 
                  />
                  <button type="submit" className="bg-gold-500 text-charcoal-900 px-4 py-2 rounded text-sm font-bold hover:bg-gold-400">JOIN</button>
                </form>
              )}
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-600 text-xs">© 2024 Frosty Bite Luxury Bakery. All rights reserved.</p>
            <p className="text-neutral-600 text-xs">Designed for SaaS Excellence.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <StoreProvider>
      <Router>
        <LayoutWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* User Routes */}
            <Route path="/dashboard" element={<UserDashboard />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="coupons" element={<CouponManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </LayoutWrapper>
      </Router>
    </StoreProvider>
  );
}

export default App;