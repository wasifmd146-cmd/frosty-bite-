import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { Button } from '../../components/ui/Button';

export const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, applyCoupon, placeOrder, user } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = () => {
    const amount = applyCoupon(couponCode);
    if (amount > 0) {
      setDiscount(amount);
      alert(`Coupon applied! You saved $${amount.toFixed(2)}`);
    } else {
      alert('Invalid coupon code, minimum order value not met, or coupon expired.');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsCheckingOut(true);
    setTimeout(() => {
      placeOrder();
      setIsCheckingOut(false);
      alert('Order placed successfully! Thank you for choosing Frosty Bite.');
      navigate('/');
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 text-neutral-600">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-serif text-white mb-4">Your Cart is Empty</h1>
        <p className="text-neutral-400 mb-8 text-center max-w-md">Looks like you haven't indulged in anything yet. Our chefs are waiting.</p>
        <Link to="/shop">
          <Button>BROWSE COLLECTION</Button>
        </Link>
      </div>
    );
  }

  const finalTotal = cartTotal - discount;

  return (
    <div className="min-h-screen bg-charcoal-950 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-white mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="glass-panel p-4 rounded-lg flex items-center gap-4 md:gap-6">
                <img src={item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md" />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-white font-serif text-lg">{item.name}</h3>
                    <p className="text-gold-500 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="text-neutral-500 text-sm mb-4">{item.category}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-black/20 rounded px-2 py-1">
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="text-neutral-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="text-neutral-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="glass-panel p-8 rounded-lg h-fit sticky top-32">
            <h3 className="text-xl font-serif text-white mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-gold-500">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-white/10 flex justify-between text-white font-medium text-lg">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-gold-500 outline-none uppercase"
                />
                <Button variant="outline" size="sm" onClick={handleApplyCoupon}>APPLY</Button>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'PROCESSING...' : 'PROCEED TO CHECKOUT'} <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};