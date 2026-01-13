import React, { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Search, Upload } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { Button } from '../../components/ui/Button';
import { Product } from '../../types';

export const ProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Cakes',
    price: 0,
    stock: 0,
    description: '',
    image: '',
    isFeatured: false
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'Cakes',
        price: 0,
        stock: 0,
        description: '',
        image: 'https://picsum.photos/seed/new/600/600',
        isFeatured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct({
        ...formData as Product,
        id: Math.random().toString(36).substr(2, 9),
        rating: 5.0
      });
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif text-white mb-1">Product Inventory</h1>
          <p className="text-neutral-400 text-sm">Manage your bakery items and stock.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} /> Add Product
        </Button>
      </div>

      <div className="glass-panel p-4 rounded-lg mb-6 flex items-center gap-4">
        <Search className="text-neutral-500" size={20} />
        <input 
          type="text"
          placeholder="Search products..."
          className="bg-transparent border-none outline-none text-white w-full placeholder:text-neutral-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="glass-panel rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5 text-neutral-400 text-sm uppercase tracking-wider">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt="" className="w-10 h-10 rounded object-cover" />
                    <span className="text-white font-medium">{product.name}</span>
                    {product.isFeatured && <span className="text-[10px] bg-gold-500/20 text-gold-500 px-2 py-0.5 rounded">Featured</span>}
                  </div>
                </td>
                <td className="p-4 text-neutral-300">{product.category}</td>
                <td className="p-4 text-gold-500">${product.price.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`${product.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(product)} className="p-2 hover:bg-white/10 rounded text-neutral-300 hover:text-white">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-red-500/10 rounded text-neutral-300 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-charcoal-900 border border-white/10 w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-serif text-white">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase text-neutral-500">Name</label>
                  <input required className="w-full bg-black/20 border border-white/10 rounded p-2 text-white outline-none focus:border-gold-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase text-neutral-500">Category</label>
                  <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white outline-none focus:border-gold-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="Cakes">Cakes</option>
                    <option value="Tarts">Tarts</option>
                    <option value="Macarons">Macarons</option>
                    <option value="Pastries">Pastries</option>
                    <option value="Cupcakes">Cupcakes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase text-neutral-500">Price ($)</label>
                  <input type="number" step="0.01" required className="w-full bg-black/20 border border-white/10 rounded p-2 text-white outline-none focus:border-gold-500" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase text-neutral-500">Stock</label>
                  <input type="number" required className="w-full bg-black/20 border border-white/10 rounded p-2 text-white outline-none focus:border-gold-500" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase text-neutral-500">Description</label>
                <textarea required rows={3} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white outline-none focus:border-gold-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase text-neutral-500">Product Image</label>
                <div className="flex gap-4 items-center">
                  <img src={formData.image || 'https://via.placeholder.com/100'} alt="Preview" className="w-16 h-16 rounded object-cover border border-white/10" />
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      placeholder="Image URL" 
                      className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm outline-none focus:border-gold-500"
                      value={formData.image} 
                      onChange={e => setFormData({...formData, image: e.target.value})} 
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">OR</span>
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-white/10 text-white text-xs px-3 py-1.5 rounded hover:bg-white/20"
                      >
                        <Upload size={12} /> Upload File
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="accent-gold-500 w-4 h-4" />
                <label htmlFor="isFeatured" className="text-white text-sm">Feature on Homepage</label>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">{editingProduct ? 'Save Changes' : 'Create Product'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};