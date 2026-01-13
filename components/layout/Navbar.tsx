import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Menu, X, LayoutDashboard } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { UserRole } from '../../types';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, cart } = useStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-charcoal-950/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-serif italic font-bold text-white tracking-wider">
          Frosty<span className="text-gold-500">Bite</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm tracking-widest hover:text-gold-500 transition-colors ${location.pathname === '/' ? 'text-gold-500' : 'text-neutral-300'}`}>HOME</Link>
          <Link to="/shop" className={`text-sm tracking-widest hover:text-gold-500 transition-colors ${location.pathname === '/shop' ? 'text-gold-500' : 'text-neutral-300'}`}>SHOP</Link>
          <Link to="/about" className="text-sm tracking-widest hover:text-gold-500 transition-colors text-neutral-300">ABOUT</Link>
          
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-2 text-sm text-gold-500 border border-gold-500/30 px-3 py-1 rounded hover:bg-gold-500/10">
              <LayoutDashboard size={14} /> ADMIN
            </Link>
          )}
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-6">
          <Link to={user ? "/profile" : "/login"} className="text-neutral-300 hover:text-gold-500 transition-colors">
            <UserIcon size={20} />
          </Link>
          <div className="relative group">
            <button className="text-neutral-300 hover:text-gold-500 transition-colors">
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-charcoal-900 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            
            {/* Mini Cart Preview (Hover) */}
            <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="w-64 glass-panel p-4 rounded-sm">
                <p className="text-sm font-medium mb-2 text-gold-500">Your Bag ({cart.length})</p>
                {cart.length === 0 ? (
                  <p className="text-xs text-neutral-500">Your bag is empty.</p>
                ) : (
                  <div className="space-y-2 mb-3">
                    {cart.slice(0,3).map(item => (
                      <div key={item.id} className="flex justify-between items-center text-xs text-neutral-300">
                        <span>{item.name}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    ))}
                    {cart.length > 3 && <p className="text-xs text-neutral-500 italic">...and {cart.length - 3} more</p>}
                  </div>
                )}
                <Link to="/cart" className="block w-full text-center bg-gold-600 text-charcoal-900 text-xs py-2 font-bold hover:bg-gold-500 transition-colors">
                  VIEW CART
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-charcoal-900 border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300 hover:text-gold-500">HOME</Link>
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300 hover:text-gold-500">SHOP</Link>
          <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300 hover:text-gold-500">CART ({cart.length})</Link>
          <Link to={user ? "/profile" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300 hover:text-gold-500">ACCOUNT</Link>
        </div>
      )}
    </nav>
  );
};