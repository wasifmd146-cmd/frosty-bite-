import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { UserRole } from '../../types';

const StatCard = ({ title, value, sub, icon: Icon, trend, positive }: any) => (
  <div className="glass-panel p-6 rounded-lg animate-fade-in-up">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-neutral-400 text-sm mb-1">{title}</p>
        <h3 className="text-2xl text-white font-semibold">{value}</h3>
      </div>
      <div className="p-2 bg-gold-500/10 rounded-lg text-gold-500">
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-center gap-2 text-xs">
      <span className={`${positive ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
        <TrendingUp size={12} className={positive ? '' : 'rotate-180'} /> {trend}
      </span>
      <span className="text-neutral-500">vs last period</span>
    </div>
  </div>
);

export const Dashboard = () => {
  const { orders, users, products } = useStore();

  // Real-time Calculations
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
    const totalOrders = orders.length;
    const activeCustomers = users.filter(u => u.role !== UserRole.ADMIN).length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      activeCustomers,
      avgOrderValue
    };
  }, [orders, users]);

  // Generate Chart Data from Orders
  const chartData = useMemo(() => {
    // Group orders by date (last 7 days simplified)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = new Map();
    
    // Initialize with 0
    for(let i=0; i<7; i++) {
        data.set(days[i], 0);
    }

    orders.forEach(order => {
      const d = new Date(order.date);
      const dayName = days[d.getDay()];
      data.set(dayName, (data.get(dayName) || 0) + order.total);
    });

    return Array.from(data).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Calculate Top Selling Products
  const topProducts = useMemo(() => {
    const productSales = new Map<string, {name: string, count: number, revenue: number, image: string, category: string}>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales.has(item.id)) {
          productSales.set(item.id, {
            name: item.name,
            count: 0,
            revenue: 0,
            image: item.image,
            category: item.category
          });
        }
        const p = productSales.get(item.id)!;
        p.count += item.quantity;
        p.revenue += item.price * item.quantity;
      });
    });

    return Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-2xl font-serif text-white mb-2">Dashboard Overview</h1>
        <p className="text-neutral-400">Real-time store performance and analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
          sub="Live" 
          icon={DollarSign} 
          trend="Live Update" 
          positive={true} 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          sub="Live" 
          icon={ShoppingBag} 
          trend="Just now" 
          positive={true} 
        />
        <StatCard 
          title="Customers" 
          value={stats.activeCustomers} 
          sub="Live" 
          icon={Users} 
          trend="Active" 
          positive={true} 
        />
        <StatCard 
          title="Avg. Order Value" 
          value={`$${stats.avgOrderValue.toFixed(2)}`} 
          sub="Live" 
          icon={TrendingUp} 
          trend="Calculated" 
          positive={stats.avgOrderValue > 50} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-panel p-6 rounded-lg animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <h3 className="text-lg text-white font-medium mb-6">Revenue Analytics (Weekly)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#666'}} />
                <YAxis stroke="#666" tick={{fill: '#666'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff' }}
                  itemStyle={{ color: '#D4AF37' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="value" stroke="#D4AF37" fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="glass-panel p-6 rounded-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <h3 className="text-lg text-white font-medium mb-6">Best Sellers</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
            {topProducts.length === 0 ? (
               <p className="text-neutral-500 text-center py-8">No sales data yet.</p>
            ) : (
              topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-800 rounded-md overflow-hidden">
                       <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{p.name}</p>
                      <p className="text-xs text-neutral-500">{p.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${p.revenue.toFixed(2)}</p>
                    <p className="text-xs text-green-400">{p.count} sold</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};