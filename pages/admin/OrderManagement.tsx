import React, { useState } from 'react';
import { Search, Eye, Filter, Download, X, Trash2 } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { Button } from '../../components/ui/Button';
import { Order } from '../../types';

export const OrderManagement = () => {
  const { orders, updateOrderStatus, deleteOrder, users } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => 
    filterStatus === 'all' || o.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  const getUserName = (userId: string) => {
    const u = users.find(user => user.id === userId);
    return u ? u.name : 'Unknown User';
  };
  
  const getUserEmail = (userId: string) => {
    const u = users.find(user => user.id === userId);
    return u ? u.email : 'N/A';
  };

  const handleExportCSV = () => {
    const headers = "Order ID,Date,Customer,Total,Status\n";
    const rows = filteredOrders.map(o => 
      `${o.id},${new Date(o.date).toLocaleDateString()},${getUserName(o.userId)},${o.total.toFixed(2)},${o.status}`
    ).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "frosty_bite_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteOrder = () => {
    if (selectedOrder && window.confirm("Are you sure you want to permanently delete this order?")) {
      deleteOrder(selectedOrder.id);
      setSelectedOrder(null);
    }
  };

  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif text-white mb-1">Orders</h1>
          <p className="text-neutral-400 text-sm">Track and manage customer orders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
            <Download size={14} /> Export CSV
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'processing', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${
              filterStatus === status 
                ? 'bg-gold-500 text-charcoal-900 font-bold' 
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="glass-panel rounded-lg overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            No orders found in this category.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-neutral-400 text-sm uppercase tracking-wider">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-neutral-300">#{order.id}</td>
                  <td className="p-4 text-white">
                    <div className="text-sm font-medium">{getUserName(order.userId)}</div>
                  </td>
                  <td className="p-4 text-neutral-400">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-4 text-neutral-300">
                    {order.items.length} items
                  </td>
                  <td className="p-4 text-gold-500">${order.total.toFixed(2)}</td>
                  <td className="p-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      className={`px-3 py-1 rounded border text-xs font-medium uppercase outline-none cursor-pointer appearance-none ${getStatusColor(order.status)}`}
                    >
                      <option value="pending" className="bg-charcoal-900 text-yellow-400">Pending</option>
                      <option value="processing" className="bg-charcoal-900 text-blue-400">Processing</option>
                      <option value="completed" className="bg-charcoal-900 text-green-400">Completed</option>
                      <option value="cancelled" className="bg-charcoal-900 text-red-400">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-neutral-400 hover:text-white p-2"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-charcoal-900 border border-white/10 w-full max-w-lg rounded-lg shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-serif text-white">Order Details</h2>
                <p className="text-neutral-500 text-sm font-mono">#{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="mb-6 bg-white/5 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-neutral-500 mb-2">Customer Info</h3>
                <p className="text-white font-medium">{getUserName(selectedOrder.userId)}</p>
                <p className="text-neutral-400 text-sm">{getUserEmail(selectedOrder.userId)}</p>
                <p className="text-neutral-400 text-sm mt-1">{new Date(selectedOrder.date).toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm uppercase text-neutral-500 border-b border-white/10 pb-2">Items</h3>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-12 h-12 rounded object-cover border border-white/10" />
                      <div>
                        <p className="text-white text-sm">{item.name}</p>
                        <p className="text-neutral-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-gold-500 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-lg text-white font-serif">Total Amount</span>
                <span className="text-xl text-gold-500 font-bold">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20 flex justify-between">
              <button 
                type="button"
                onClick={handleDeleteOrder} 
                className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 hover:bg-red-500/10 rounded transition-colors"
              >
                <Trash2 size={16} /> Delete Order
              </button>
              <Button onClick={() => setSelectedOrder(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};