import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, Star } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { Button } from '../../components/ui/Button';

export const Shop = () => {
  const { products } = useStore();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-charcoal-950 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-white mb-4">The Collection</h1>
          <p className="text-neutral-400 max-w-xl mx-auto">Browse our artisanal selection of fine pastries, cakes, and desserts.</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 glass-panel p-6 rounded-lg">
          
          {/* Categories */}
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-sm whitespace-nowrap px-4 py-2 rounded-full transition-all ${
                  filter === cat 
                    ? 'bg-gold-500 text-charcoal-900 font-semibold' 
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-charcoal-950 border border-neutral-800 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-neutral-600"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredProducts.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="group">
              <div className="relative bg-charcoal-900 rounded-lg overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all duration-300">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  {product.stock < 10 && (
                    <span className="absolute top-4 right-4 bg-red-900/80 text-red-100 text-xs px-2 py-1 rounded backdrop-blur-sm border border-red-500/20">
                      Low Stock
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif text-white group-hover:text-gold-500 transition-colors">{product.name}</h3>
                    <span className="text-gold-400 font-medium">${product.price}</span>
                  </div>
                  <p className="text-neutral-500 text-sm line-clamp-2 mb-4">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-600 uppercase tracking-wider">{product.category}</span>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-gold-500 fill-gold-500" />
                      <span className="text-sm text-neutral-400">{product.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};