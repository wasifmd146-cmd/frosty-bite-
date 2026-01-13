import React from 'react';
import { MoreVertical, Mail, Shield, Trash2, Calendar } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { UserRole } from '../../types';

export const UserManagement = () => {
  const { users, deleteUser, orders } = useStore();

  const handleDelete = (id: string, role: UserRole) => {
    if (role === UserRole.ADMIN) {
      alert("Cannot delete an admin user.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  const getUserSpend = (userId: string) => {
    return orders.filter(o => o.userId === userId).reduce((acc, o) => acc + o.total, 0);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white mb-1">Customers</h1>
        <p className="text-neutral-400 text-sm">View registered users and their activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-lg">
           <h3 className="text-neutral-400 text-sm mb-2">Total Users</h3>
           <p className="text-3xl text-white font-serif">{users.length}</p>
        </div>
        <div className="glass-panel p-6 rounded-lg">
           <h3 className="text-neutral-400 text-sm mb-2">New This Month</h3>
           <p className="text-3xl text-gold-500 font-serif">
             +{users.filter(u => u.joined?.startsWith(new Date().toISOString().slice(0, 7))).length}
           </p>
        </div>
        <div className="glass-panel p-6 rounded-lg">
           <h3 className="text-neutral-400 text-sm mb-2">Active VIPs</h3>
           <p className="text-3xl text-white font-serif">
             {users.filter(u => getUserSpend(u.id) > 500).length}
           </p>
        </div>
      </div>

      <div className="glass-panel rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5 text-neutral-400 text-sm uppercase tracking-wider">
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Total Spent</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                       <img src={u.avatar} alt={u.name} className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{u.name}</p>
                      <p className="text-neutral-500 text-xs flex items-center gap-1">
                        <Mail size={10} /> {u.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                   <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${u.role === UserRole.ADMIN ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                     {u.role === UserRole.ADMIN && <Shield size={10} />}
                     {u.role}
                   </span>
                </td>
                <td className="p-4 text-neutral-400 text-sm flex items-center gap-2">
                  <Calendar size={12} />
                  {u.joined || 'N/A'}
                </td>
                <td className="p-4 text-white font-medium">${getUserSpend(u.id).toFixed(2)}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(u.id, u.role)}
                    className="text-neutral-500 hover:text-red-400 transition-colors p-2"
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};