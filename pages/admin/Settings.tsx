import React, { useState } from 'react';
import { useStore } from '../../store/StoreContext';
import { StoreSettings } from '../../types';
import { Button } from '../../components/ui/Button';
import { Save, AlertTriangle, CheckCircle } from 'lucide-react';

export const Settings = () => {
  const { user, updateUserProfile, settings, updateStoreSettings } = useStore();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [storeData, setStoreData] = useState<StoreSettings>({
    storeName: settings?.storeName || 'Frosty Bite',
    currency: settings?.currency || 'USD',
    taxRate: settings?.taxRate || 0.08,
    maintenanceMode: settings?.maintenanceMode || false,
    emailNotifications: settings?.emailNotifications || true,
  });

  const [message, setMessage] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileData);
    setMessage('Profile updated successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleStoreUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(storeData);
    setMessage('Store settings saved.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white mb-1">System Settings</h1>
        <p className="text-neutral-400 text-sm">Configure store parameters and admin profile.</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg flex items-center gap-2 animate-fade-in-up">
          <CheckCircle size={18} /> {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="glass-panel p-6 rounded-lg h-fit">
          <h2 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">Admin Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase text-neutral-500">Display Name</label>
              <input 
                type="text" 
                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white outline-none focus:border-gold-500"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase text-neutral-500">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white outline-none focus:border-gold-500"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full mt-4">Update Profile</Button>
          </form>
        </div>

        {/* Store Settings */}
        <div className="glass-panel p-6 rounded-lg">
          <h2 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">Store Configuration</h2>
          <form onSubmit={handleStoreUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase text-neutral-500">Store Name</label>
              <input 
                type="text" 
                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white outline-none focus:border-gold-500"
                value={storeData.storeName}
                onChange={(e) => setStoreData({...storeData, storeName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase text-neutral-500">Currency</label>
                <select 
                  className="w-full bg-black/20 border border-white/10 rounded p-3 text-white outline-none focus:border-gold-500"
                  value={storeData.currency}
                  onChange={(e) => setStoreData({...storeData, currency: e.target.value})}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase text-neutral-500">Tax Rate (%)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full bg-black/20 border border-white/10 rounded p-3 text-white outline-none focus:border-gold-500"
                  value={storeData.taxRate}
                  onChange={(e) => setStoreData({...storeData, taxRate: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white text-sm">Email Notifications</p>
                <p className="text-xs text-neutral-500">Receive alerts for new orders</p>
              </div>
              <input 
                type="checkbox" 
                className="accent-gold-500 w-5 h-5"
                checked={storeData.emailNotifications}
                onChange={(e) => setStoreData({...storeData, emailNotifications: e.target.checked})}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-400" size={20} />
                <div>
                  <p className="text-red-400 text-sm font-medium">Maintenance Mode</p>
                  <p className="text-xs text-neutral-500">Disable store for public</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                className="accent-red-500 w-5 h-5"
                checked={storeData.maintenanceMode}
                onChange={(e) => setStoreData({...storeData, maintenanceMode: e.target.checked})}
              />
            </div>

            <Button type="submit" className="w-full mt-2 gap-2">
              <Save size={18} /> Save Configurations
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};