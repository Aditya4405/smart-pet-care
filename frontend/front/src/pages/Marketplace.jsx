import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Filter, Star, Plus, Minus, X, ShoppingCart, Tag
} from 'lucide-react';

const Marketplace = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Mock Products Data
  const products = [
    { id: 1, name: "Premium Royal Canin Dog Food", category: "Food", price: 45.99, rating: 4.8, reviews: 124, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=300&q=80", inStock: true },
    { id: 2, name: "Orthopedic Memory Foam Pet Bed", category: "Accessories", price: 65.00, rating: 4.9, reviews: 89, image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=300&q=80", inStock: true },
    { id: 3, name: "Flea & Tick Prevention Drops", category: "Medicine", price: 25.50, rating: 4.7, reviews: 210, image: "https://images.unsplash.com/photo-1628043425377-515cb6b38c35?auto=format&fit=crop&w=300&q=80", inStock: true },
    { id: 4, name: "Interactive Laser Toy for Cats", category: "Toys", price: 15.99, rating: 4.5, reviews: 342, image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=300&q=80", inStock: true },
    { id: 5, name: "Dental Chew Sticks (30 Pack)", category: "Food", price: 18.00, rating: 4.6, reviews: 156, image: "https://images.unsplash.com/photo-1605646194723-5e786b5b5c92?auto=format&fit=crop&w=300&q=80", inStock: false },
    { id: 6, name: "Heavy Duty Dog Leash", category: "Accessories", price: 22.00, rating: 4.8, reviews: 78, image: "https://images.unsplash.com/photo-1601322079148-93663a8a07c9?auto=format&fit=crop&w=300&q=80", inStock: true },
  ];

  const categories = ['All', 'Food', 'Toys', 'Medicine', 'Accessories'];

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart Functions
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Pet Marketplace</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">
            Premium products for your furry friends.
          </p>
        </div>
        
        {/* Cart Button */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 px-5 py-3 rounded-2xl transition-all relative group"
        >
           <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-white group-hover:text-cyan-500 transition-colors" />
           <span className="font-bold text-slate-900 dark:text-white">${cartTotal.toFixed(2)}</span>
           
           {/* Badge */}
           {cartItemCount > 0 && (
               <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                 {cartItemCount}
               </span>
           )}
        </button>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
           <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search products..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-sm transition-all"
           />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {categories.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border ${
                        selectedCategory === cat 
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/20' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-cyan-500/30 transition-all duration-300 flex flex-col group">
                
                {/* Image Area */}
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm dark:bg-slate-900/90 px-3 py-1 rounded-lg text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 shadow-sm">
                        <Tag className="w-3 h-3 text-cyan-500" /> {product.category}
                    </div>
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold tracking-wide uppercase text-sm">Out of Stock</span>
                        </div>
                    )}
                </div>

                {/* Details Area */}
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">{product.name}</h3>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-4">
                         <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                         <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
                         <span className="text-xs text-slate-400">({product.reviews})</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                        
                        <button 
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                product.inStock 
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-110 shadow-lg' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            <ShoppingBag className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        ))}
        {filteredProducts.length === 0 && (
             <div className="col-span-full py-20 text-center">
                 <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Search className="w-10 h-10 text-slate-400" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">No products found</h3>
                 <p className="text-slate-500 mt-2">Try adjusting your search or category filters.</p>
             </div>
        )}
      </div>

      {/* --- SLIDE OVER CART UI --- */}
      {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in"
                onClick={() => setIsCartOpen(false)}
              ></div>

              {/* Cart Panel */}
              <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                  
                  {/* Cart Header */}
                  <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5 text-cyan-600" /> Your Cart
                      </h2>
                      <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                          <X className="w-5 h-5" />
                      </button>
                  </div>

                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {cart.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-400">
                              <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
                              <p className="font-medium text-lg">Your cart is empty</p>
                              <button onClick={() => setIsCartOpen(false)} className="mt-4 text-cyan-600 font-bold hover:underline">Continue Shopping</button>
                          </div>
                      ) : (
                          cart.map((item) => (
                              <div key={item.id} className="flex gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                                  <div className="flex-1 flex flex-col justify-between">
                                      <div className="flex justify-between items-start gap-2">
                                          <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">{item.name}</h4>
                                          <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4"/></button>
                                      </div>
                                      
                                      <div className="flex justify-between items-end mt-2">
                                          <span className="font-bold text-cyan-600">${(item.price * item.qty).toFixed(2)}</span>
                                          
                                          {/* Qty Controls */}
                                          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                                              <button onClick={() => updateQty(item.id, -1)} className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"><Minus className="w-3 h-3"/></button>
                                              <span className="text-sm font-bold w-4 text-center dark:text-white">{item.qty}</span>
                                              <button onClick={() => updateQty(item.id, 1)} className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"><Plus className="w-3 h-3"/></button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>

                  {/* Cart Footer / Checkout */}
                  {cart.length > 0 && (
                      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                          <div className="space-y-3 mb-6">
                              <div className="flex justify-between text-slate-500 text-sm font-medium">
                                  <span>Subtotal</span>
                                  <span className="text-slate-900 dark:text-white">${cartTotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-slate-500 text-sm font-medium">
                                  <span>Taxes & Shipping</span>
                                  <span className="text-slate-900 dark:text-white">Calculated at checkout</span>
                              </div>
                              <div className="flex justify-between text-lg font-bold border-t border-slate-100 dark:border-slate-800 pt-3">
                                  <span className="text-slate-900 dark:text-white">Total</span>
                                  <span className="text-cyan-600">${cartTotal.toFixed(2)}</span>
                              </div>
                          </div>
                          
                          <button 
                            onClick={() => {
                                alert("Proceeding to Checkout!");
                                setIsCartOpen(false);
                            }}
                            className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-xl hover:opacity-90 transition-opacity"
                          >
                              Checkout Now
                          </button>
                      </div>
                  )}

              </div>
          </div>
      )}

    </div>
  );
};

export default Marketplace;