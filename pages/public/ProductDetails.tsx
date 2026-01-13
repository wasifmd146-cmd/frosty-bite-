import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, Star, ArrowLeft, ShoppingBag, User as UserIcon } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { Button } from '../../components/ui/Button';

export const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart, reviews, user, addReview } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-serif mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-gold-500 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const productReviews = reviews.filter(r => r.productId === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmittingReview(true);
    // Simulate network delay
    setTimeout(() => {
      addReview(product.id, newReviewRating, newReviewComment);
      setNewReviewComment('');
      setNewReviewRating(5);
      setIsSubmittingReview(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-charcoal-950 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/shop" className="inline-flex items-center gap-2 text-neutral-400 hover:text-gold-500 mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Image */}
          <div className="relative aspect-square bg-charcoal-900 rounded-lg overflow-hidden border border-white/5 group sticky top-32">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-gold-500/10 text-gold-500 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-gold-400 text-sm">
                  <Star size={14} fill="currentColor" /> {product.rating.toFixed(1)} <span className="text-neutral-500 ml-1">({productReviews.length} reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{product.name}</h1>
              <p className="text-3xl text-gold-500 font-light">${product.price}</p>
            </div>

            <p className="text-neutral-400 leading-relaxed text-lg font-light">
              {product.description}
            </p>

            <div className="py-6 border-t border-white/10 border-b">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center border border-white/10 rounded-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 text-white hover:text-gold-500 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-white font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-4 text-white hover:text-gold-500 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <Button onClick={handleAddToCart} size="lg" className="flex-1 gap-3">
                  <ShoppingBag size={20} /> ADD TO CART - ${(product.price * quantity).toFixed(2)}
                </Button>
              </div>
            </div>

            <div className="space-y-4 text-sm text-neutral-500">
              <p>• Premium artisanal ingredients</p>
              <p>• Handcrafted daily by master chefs</p>
              <p>• Guaranteed freshness upon delivery</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-white/10 pt-16">
          <h2 className="text-3xl font-serif text-white mb-10">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-8">
              {productReviews.length === 0 ? (
                <div className="p-8 bg-white/5 rounded-lg text-center text-neutral-400">
                  No reviews yet. Be the first to taste and tell!
                </div>
              ) : (
                productReviews.map((review) => (
                  <div key={review.id} className="border-b border-white/5 pb-8 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-charcoal-800 flex items-center justify-center text-gold-500">
                           <UserIcon size={20} />
                        </div>
                        <div>
                          <p className="text-white font-medium">{review.userName}</p>
                          <p className="text-xs text-neutral-500">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            className={star <= review.rating ? "text-gold-500 fill-gold-500" : "text-neutral-700"} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write Review Form */}
            <div className="glass-panel p-6 rounded-lg h-fit">
              <h3 className="text-xl font-serif text-white mb-6">Write a Review</h3>
              
              {!user ? (
                <div className="text-center py-6">
                  <p className="text-neutral-400 mb-4">Please sign in to leave a review.</p>
                  <Link to="/login">
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase text-neutral-500">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            size={24} 
                            className={star <= newReviewRating ? "text-gold-500 fill-gold-500" : "text-neutral-700"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase text-neutral-500">Your Review</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-black/20 border border-white/10 rounded p-3 text-white outline-none focus:border-gold-500 resize-none placeholder:text-neutral-600"
                      placeholder="Share your experience..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmittingReview}>
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};