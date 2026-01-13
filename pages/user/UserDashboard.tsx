import React, { useState } from 'react';
import { useStore } from '../../store/StoreContext';
import { User, LogOut, Package, CreditCard, Settings, User as UserIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const UserDashboard = () => {
  const { user, logout, updateUserProfile, orders } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
  };

  const userOrders = orders.filter(o => o.userId === user.id);
  const totalSpent = userOrders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="min-h-screen bg-charcoal-950 pt-28 pb-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="glass-panel p-6 rounded-lg h-fit space-y-6">
          <div className="text-center pb-6 border-b border-white/5">
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-gold-500">
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-serif text-white">{user.name}</h2>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1">{user.role}</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: UserIcon },
              { id: 'orders', label: 'Order History', icon: Package },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm transition-all ${
                  activeTab === item.id 
                    ? 'bg-gold-500 text-charcoal-900 font-bold' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm text-red-400 hover:bg-red-500/10 transition-colors mt-8"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-lg">
                  <p className="text-neutral-400 text-sm mb-1">Total Orders</p>
                  <p className="text-3xl font-serif text-white">{userOrders.length}</p>
                </div>
                <div className="glass-panel p-6 rounded-lg">
                  <p className="text-neutral-400 text-sm mb-1">Total Spent</p>
                  <p className="text-3xl font-serif text-gold-500">${totalSpent.toFixed(2)}</p>
                </div>
                <div className="glass-panel p-6 rounded-lg">
                  <p className="text-neutral-400 text-sm mb-1">Membership Status</p>
                  <p className="text-xl font-serif text-white mt-1">Silver Member</p>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-lg">
                <h3 className="text-xl font-serif text-white mb-6">Profile Details</h3>
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                      <span className="text-neutral-500">Full Name</span>
                      <span className="text-white text-right">{user.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                      <span className="text-neutral-500">Email Address</span>
                      <span className="text-white text-right">{user.email}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <span className="text-neutral-500">Member Since</span>
                      <span className="text-white text-right">{user.joined || '2024-01-01'}</span>
                    </div>
                    <div className="pt-6">
                      <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase text-neutral-500">Full Name</label>
                        <input 
                          className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-gold-500 outline-none"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase text-neutral-500">Email</label>
                        <input 
                          className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-gold-500 outline-none"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button type="submit">Save Changes</Button>
                      <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
             <div className="glass-panel rounded-lg overflow-hidden animate-fade-in-up">
               <div className="p-6 border-b border-white/5">
                 <h3 className="text-xl font-serif text-white">Order History</h3>
               </div>
               {userOrders.length === 0 ? (
                 <div className="p-12 text-center text-neutral-500">
                   <Package size={48} className="mx-auto mb-4 opacity-50" />
                   <p>No orders placed yet.</p>
                 </div>
               ) : (
                 <table className="w-full text-left">
                   <thead className="bg-white/5 text-neutral-400 text-sm uppercase">
                     <tr>
                       <th className="p-4">Order ID</th>
                       <th className="p-4">Date</th>
                       <th className="p-4">Status</th>
                       <th className="p-4 text-right">Total</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {userOrders.map(order => (
                       <tr key={order.id} className="text-sm">
                         <td className="p-4 font-mono text-neutral-300">#{order.id}</td>
                         <td className="p-4 text-neutral-400">{new Date(order.date).toLocaleDateString()}</td>
                         <td className="p-4">
                           <span className={`capitalize px-2 py-1 rounded text-xs ${
                             order.status === 'completed' ? 'bg-green-500/10 text-green-400' : 
                             order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'text-neutral-400'
                           }`}>
                             {order.status}
                           </span>
                         </td>
                         <td className="p-4 text-right text-gold-500 font-medium">${order.total.toFixed(2)}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               )}
             </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="glass-panel p-8 rounded-lg animate-fade-in-up">
              <h3 className="text-xl font-serif text-white mb-6">Security Settings</h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between py-4 border-b border-white/5">
                   <div>
                     <p className="text-white">Two-Factor Authentication</p>
                     <p className="text-xs text-neutral-500">Add an extra layer of security to your account.</p>
                   </div>
                   <Button variant="outline" size="sm">Enable</Button>
                 </div>
                 <div className="flex items-center justify-between py-4 border-b border-white/5">
                   <div>
                     <p className="text-white">Change Password</p>
                     <p className="text-xs text-neutral-500">Update your password regularly.</p>
                   </div>
                   <Button variant="outline" size="sm">Update</Button>
                 </div>
                 <div className="flex items-center justify-between py-4">
                   <div>
                     <p className="text-red-400">Delete Account</p>
                     <p className="text-xs text-neutral-500">Permanently remove your account and data.</p>
                   </div>
                   <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-500 hover:bg-red-500/10">Delete</Button>
                 </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};