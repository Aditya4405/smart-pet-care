import React from 'react';
import { Star, Edit, Trash2, Power, ShoppingBag, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ 
  product, 
  isAdmin, 
  onAddToCart, 
  onEdit, 
  onDelete, 
  onToggleStock,
  onToggleWishlist
}) => {
  const navigate = useNavigate();
  const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  const isOutOfStock = product.stockQuantity === 0 || !product.inStock;

  const currentUser = JSON.parse(localStorage.getItem('user')) || { role: 'USER' };
  const portalPath = currentUser.role?.toUpperCase() === 'VETERINARIAN' || currentUser.role?.toUpperCase() === 'VET' ? 'vet' : 'owner';

  // Dynamic Badge Styling
  const getBadgeStyle = (badge) => {
    if (!badge) return null;
    if (badge.includes('-')) return 'bg-red-500 text-white'; 
    if (badge === 'Best Seller') return 'bg-amber-400 text-amber-950';
    if (badge === 'New Arrival') return 'bg-emerald-500 text-white';
    return 'bg-indigo-500 text-white'; 
  };

  const handleCardClick = () => {
    navigate(`/${isAdmin ? 'admin' : portalPath}/product/${product.id}`);
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border ${isOutOfStock ? 'border-red-200 dark:border-red-900/50 opacity-80' : 'border-slate-200 dark:border-slate-700'} overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group relative cursor-pointer`}
         onClick={handleCardClick}
    >
      
      {/* Image & Badges */}
      <div className="relative h-56 bg-slate-50 dark:bg-slate-900 p-6 flex items-center justify-center border-b border-slate-100 dark:border-slate-700 overflow-hidden">
        <img 
          // ✅ FIXED: Added a fallback placeholder so src is NEVER an empty string ""
          src={product.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300'} 
          alt={product.name} 
          className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500" 
        />
        
        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 bg-white/60 dark:bg-slate-900/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xs tracking-widest uppercase shadow-lg">Out of Stock</span>
          </div>
        )}

        {/* Section Badge */}
        {product.badge && !isOutOfStock && (
           <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm z-20 ${getBadgeStyle(product.badge)}`}>
             {product.badge}
           </span>
        )}

        {/* Wishlist Button */}
        {!isAdmin && (
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
            className="absolute top-3 right-3 z-20 p-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full shadow-sm text-slate-300 dark:text-slate-500 hover:text-red-500 hover:shadow-md transition-all active:scale-125"
          >
            <Heart className={`w-4 h-4 transition-colors ${product.isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{product.name}</h3>
        
        <div className="flex items-center gap-1 mb-4 group-hover:text-amber-500 transition-colors">
           <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
           <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
           <span className="text-xs text-slate-400">({product.reviews})</span>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
          {isAdmin ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xl font-extrabold text-slate-900 dark:text-white">{formatINR(product.price)}</span>
                 <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Stock: {product.stockQuantity}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={(e) => { e.stopPropagation(); onEdit(product); }} className="py-2 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-all flex justify-center items-center gap-1"><Edit size={14}/> Edit</button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(product.id); }} className="py-2 rounded-lg text-xs font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 transition-all flex justify-center items-center gap-1"><Trash2 size={14}/> Delete</button>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onToggleStock(product.id); }} className={`w-full py-2 rounded-lg text-xs font-bold flex justify-center items-center gap-1 border transition-all ${isOutOfStock ? 'border-emerald-200 text-emerald-600' : 'border-amber-200 text-amber-600'}`}>
                <Power size={14}/> {isOutOfStock ? 'Mark In Stock' : 'Mark Out of Stock'}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{formatINR(product.price)}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                disabled={isOutOfStock}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isOutOfStock ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-lg hover:scale-105'}`}
              >
                Add <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;