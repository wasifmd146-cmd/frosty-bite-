import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Award, Truck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useStore } from '../../store/StoreContext';
import { motion } from 'framer-motion';

export const Home = () => {
  const { products } = useStore();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 3);

  return (
    <div className="min-h-screen bg-charcoal-950">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1626803775151-61d756412f56?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Bakery Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/50 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
          <h2 className="text-gold-500 tracking-[0.2em] text-sm md:text-base font-semibold uppercase mb-4 animate-fade-in-up">
            Artisanal Excellence
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            Indulge in <br/> <span className="italic text-gold-100">Perfection</span>
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Frosty Bite redefines the art of baking with premium ingredients, sophisticated aesthetics, and flavors that linger in memory.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center pt-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <Link to="/shop">
              <Button size="lg" className="w-full md:w-auto">EXPLORE COLLECTION</Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full md:w-auto">OUR STORY</Button>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-12 bg-charcoal-900 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Star, title: "Premium Ingredients", desc: "Sourced globally for unmatched quality." },
            { icon: Award, title: "Master Chefs", desc: "Crafted by award-winning patissiers." },
            { icon: Truck, title: "White Glove Delivery", desc: "Arrives pristine at your doorstep." }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4 text-center md:text-left justify-center md:justify-start">
              <div className="p-3 bg-gold-500/10 rounded-full text-gold-500">
                <feature.icon size={24} />
              </div>
              <div>
                <h3 className="text-white font-serif text-lg">{feature.title}</h3>
                <p className="text-neutral-500 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-serif text-white mb-2">Curated Selections</h2>
            <p className="text-neutral-400">Our masterpieces, baked fresh daily.</p>
          </div>
          <Link to="/shop" className="text-gold-500 hover:text-gold-400 flex items-center gap-2 text-sm tracking-widest group">
            VIEW ALL <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="group block">
              <div className="relative overflow-hidden mb-6 rounded-sm">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button className="w-full">VIEW DETAILS</Button>
                </div>
              </div>
              <h3 className="text-2xl font-serif text-white group-hover:text-gold-500 transition-colors">{product.name}</h3>
              <p className="text-gold-500 font-medium mt-1">${product.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};