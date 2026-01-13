import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Ticket, Menu, X } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { UserRole } from '../../types';

export const AdminLayout = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (user?.role !== UserRole.ADMIN) {
    return (
      <div className="h-screen bg-charcoal-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-red-500 mb-2">Access Denied</h1>
          <p className="text-neutral-400 mb-4">You do not have permission to view this area.</p>
          <button onClick={() => navigate('/')} className="text-gold-500 underline">Return Home</button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Customers', path: '/admin/users' },
    { icon: Ticket, label: 'Coupons', path: '/admin/coupons' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-charcoal-950 overflow-hidden relative">
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 w-full z-20 bg-charcoal-900 border-b border-white/5 p-4 flex justify-between items-center">
        <h2 className="text-lg font-serif font-bold text-white tracking-wider">
            Frosty<span className="text-gold-500">Admin</span>
        </h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`absolute md:relative z-40 h-full w-64 border-r border-white/5 bg-charcoal-900 flex flex-col transition-transform duration-300 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-white/5 hidden md:block">
           <h2 className="text-xl font-serif font-bold text-white tracking-wider">
            Frosty<span className="text-gold-500">Admin</span>
          </h2>
        </div>
        {/* Mobile Header spacer */}
        <div className="h-16 md:hidden"></div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all ${
                  isActive 
                    ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
             <img src={user.avatar} alt="Admin" className="w-8 h-8 rounded-full" />
             <div className="overflow-hidden">
               <p className="text-sm text-white truncate">{user.name}</p>
               <p className="text-xs text-neutral-500 truncate">{user.email}</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-red-400 hover:bg-red-500/10 rounded-md text-sm transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 w-full">
        <Outlet />
      </main>
    </div>
  );
};