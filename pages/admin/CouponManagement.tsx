import React, { useState } from 'react';
import { Plus, Trash2, Tag, RefreshCw, Calendar } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { Button } from '../../components/ui/Button';
import { Coupon } from '../../types';

export const CouponManagement = () => {
  const { coupons, addCoupon, deleteCoupon } = useStore();
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    value: 10,
    minOrderValue: 50,
    expiryDate: ''
  });

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon(prev => ({ ...prev, code: code }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.value) return;
    
    addCoupon(newCoupon as Coupon);
    setNewCoupon({
      code: '',
      discountType: 'percentage',
      value: 10,
      minOrderValue: 50,
      expiryDate: ''
    });
  };

  return (
    <div className="max-w-4xl pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white mb-1">Coupon Management</h1>
        <p className="text-neutral-400 text-sm">Create and manage discount codes for your customers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Coupon Form */}
        <div className="glass-panel p-6 rounded-lg h-fit">
          <h2 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">Create Coupon</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase text-neutral-500">Coupon Code</label>
              <div className="flex gap-2">
                <input 
                  required
                  type="text" 
                  className="w-full bg-black/20 border border-white/10 rounded p-3 text-white outline-none focus:border-gold-500 uppercase"
                  placeholder="SUMMER25"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                />
                <button 
                  type="button" 
                  onClick={generateCode}
                  className="bg-white/10 hover:bg-white/20 text-white p-3 rounded border border-white/10 transition-colors"
                  title="Generate Random Code"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase text-neutral-500">Discount Type</label>
              <select 
                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white outline-none focus:border-gold-500"
                value={newCoupon.discountType}
                onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value as any})}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount ($)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase text-neutral-500">Value</label>
                <input 
                  required
                  type="number" 
                  min="0"
                  className="w-full bg-black/20 border border-white/10 rounded p-3 text-white outline-none focus:border-gold-500"
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({...newCoupon, value: parseFloat(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase text-neutral-500">Min. Order</label>
                <input 
                  required
                  type="number" 
                  min="0"
                  className="w-full bg-black/20 border border-white/10 rounded p-3 text-white outline-none focus:border-gold-500"
                  value={newCoupon.minOrderValue}
                  onChange={(e) => setNewCoupon({...newCoupon, minOrderValue: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase text-neutral-500">Expiry Date (Optional)</label>
              <input 
                type="date"
                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white outline-none focus:border-gold-500 [color-scheme:dark]"
                value={newCoupon.expiryDate || ''}
                onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full mt-4 gap-2">
              <Plus size={18} /> Add Coupon
            </Button>
          </form>
        </div>

        {/* Coupon List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-lg">
          <h2 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">Active Coupons</h2>
          
          {coupons.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <Tag size={48} className="mx-auto mb-4 opacity-30" />
              <p>No active coupons.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 rounded-lg p-4 flex justify-between items-center group hover:border-gold-500/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-gold-500 font-bold font-mono text-lg">{coupon.code}</span>
                      <span className="text-xs bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded uppercase">
                        {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 flex flex-col gap-1">
                      <p>Min. Order: ${coupon.minOrderValue}</p>
                      {coupon.expiryDate && (
                        <p className="flex items-center gap-1 text-neutral-400">
                           <Calendar size={10} /> Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteCoupon(coupon.code)}
                    className="text-neutral-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};