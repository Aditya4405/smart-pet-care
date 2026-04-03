import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Send, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { API } from '../../config/api';
import { useCart } from '../../context/CartContext'; // ✅ IMPORT CONTEXT

const BASE_URL = API.BASE_URL;
const API_BASE = API.BASE_API;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user')) || { role: 'USER', firstName: 'User' };
  const isAdmin = currentUser.role?.toUpperCase() === 'ADMIN';
  const portalPath = isAdmin ? 'admin' : (currentUser.role?.toUpperCase() === 'VET' ? 'vet' : 'owner');

  // ✅ USE GLOBAL CART
  const { addToCart, clearCart } = useCart();

  // State
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review Form State
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch(`${API_BASE}/products/${id}`);
        if (prodRes.ok) {
          const data = await prodRes.json();
          if (data.image && data.image.startsWith('/uploads')) data.image = `${BASE_URL}${data.image}`;
          setProduct(data);
        } else {
          toast.error("Product not found");
          navigate(-1);
          return;
        }

        const revRes = await fetch(`${API_BASE}/reviews/product/${id}`);
        if (revRes.ok) {
          setReviews(await revRes.json());
        }

      } catch (error) {
        toast.error("Network error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // ✅ NEW: Direct Buy Now Feature
  const handleBuyNow = () => {
    const instantCart = [{...product, qty: quantity}];
    const instantTotal = product.price * quantity;
    navigate(`/${portalPath}/checkout`, { 
      state: { cart: instantCart, cartTotal: instantTotal } 
    });
  };

  // SUBMIT REVIEW
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return toast.error("Please write a review first.");
    setIsSubmitting(true);
    
    const token = localStorage.getItem('token');
    const newReview = {
      productId: id,
      userId: currentUser.id || 1,
      userName: `${currentUser.firstName || 'Anonymous'} ${currentUser.lastName || ''}`.trim(),
      rating: reviewRating,
      comment: reviewText
    };

    try {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReview)
      });

      if (response.ok) {
        const savedReview = await response.json();
        setReviews([savedReview, ...reviews]); 
        toast.success("Feedback submitted!");
        setReviewText('');
        setReviewRating(5);
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ADMIN DELETE REVIEW
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Permanently delete this review?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setReviews(reviews.filter(r => r.id !== reviewId));
        toast.success("Review deleted successfully.");
      }
    } catch (error) { toast.error("Network error"); }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">Loading product details...</p>
    </div>
  );

  if (!product) return null;

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : product.rating;

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-3 mb-8 text-sm font-medium text-slate-500">
        <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
          <ChevronLeft className="w-5 h-5 text-slate-500" />
        </button>
        <span className="hover:text-indigo-600 cursor-pointer" onClick={() => navigate(-1)}>Marketplace</span>
        <span>/</span>
        <span className="hover:text-indigo-600 cursor-pointer">{product.category}</span>
        <span>/</span>
        <span className="text-slate-900 dark:text-slate-300 truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Left: Image Viewer */}
          <div className="p-8 md:p-12 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 relative">
            {product.badge && (
              <span className="absolute top-6 left-6 px-4 py-1.5 bg-red-500 text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-lg shadow-red-500/30">
                {product.badge}
              </span>
            )}
            <img src={product.image} alt={product.name} className="w-full max-w-md h-auto object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Right: Product Info */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <p className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-xs mb-2">{product.brand}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-amber-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1.5 font-bold text-slate-900 dark:text-white">{avgRating}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-slate-500 text-sm hover:underline cursor-pointer">{reviews.length} Ratings</span>
            </div>

            <div className="flex items-end gap-4 mb-6">
              <span className="text-4xl font-black text-slate-900 dark:text-white">{formatINR(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg font-bold text-slate-400 line-through mb-1">{formatINR(product.originalPrice)}</span>
              )}
            </div>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{product.description || 'A premium quality product for your beloved pet.'}</p>

            {/* Action Area */}
            {!isAdmin && (
              <div className="space-y-4">
                <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700 w-fit mb-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors font-bold text-xl">-</button>
                  <span className="w-12 text-center font-bold text-slate-900 dark:text-white">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= product.stockQuantity} className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors font-bold text-xl">+</button>
                </div>
                
                {/* ✅ BOTH BUTTONS IMPLEMENTED */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button 
                    onClick={() => addToCart(product, quantity)}
                    disabled={!product.inStock || product.stockQuantity === 0}
                    className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    {product.inStock && product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>

                  <button 
                    onClick={handleBuyNow}
                    disabled={!product.inStock || product.stockQuantity === 0}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                  >
                    Buy Now
                  </button>
                </div>
                
                {product.stockQuantity > 0 && product.stockQuantity < 5 && (
                  <p className="text-red-500 text-sm font-bold flex items-center gap-1.5 animate-pulse mt-3">
                    Hurry! Only {product.stockQuantity} left in stock.
                  </p>
                )}
              </div>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-100 dark:border-slate-700">
              <div className="flex flex-col items-center text-center text-slate-500 dark:text-slate-400">
                <Truck className="mb-2 text-emerald-500" size={24} />
                <span className="text-xs font-bold">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center text-slate-500 dark:text-slate-400">
                <RotateCcw className="mb-2 text-blue-500" size={24} />
                <span className="text-xs font-bold">7 Days Return</span>
              </div>
              <div className="flex flex-col items-center text-center text-slate-500 dark:text-slate-400">
                <ShieldCheck className="mb-2 text-indigo-500" size={24} />
                <span className="text-xs font-bold">Secure Pay</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FEEDBACK & REVIEWS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Write a Review Form (Hidden for Admins) */}
        {!isAdmin && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 h-fit">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none hover:scale-110 transition-transform"
                    >
                      <Star className={`w-8 h-8 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Your Feedback</label>
                <textarea 
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you like or dislike about this product?"
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none h-32"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
              >
                {isSubmitting ? <span className="animate-pulse">Submitting...</span> : <><Send size={16} /> Submit Feedback</>}
              </button>
            </form>
          </div>
        )}

        {/* Display Existing Reviews */}
        <div className={`bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 ${isAdmin ? 'lg:col-span-2' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Customer Reviews</h3>
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">{reviews.length} total</span>
          </div>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {reviews.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 italic py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                No reviews yet. Be the first to share your thoughts!
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 relative group">
                  
                  {/* ADMIN DELETE BUTTON */}
                  {isAdmin && (
                    <button 
                      onClick={() => handleDeleteReview(review.id)}
                      className="absolute top-4 right-4 p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Spam/Negative Review"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold uppercase">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{review.userName}</p>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-slate-400 mr-8">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pr-8">
                    "{review.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;