import React, { useState } from 'react';
import { 
  Search, ShoppingCart, Filter, Plus, Trash2, Edit, Tag, Star 
} from 'lucide-react';

const Marketplace = () => {
  // 1. Get User Role
  const user = JSON.parse(localStorage.getItem('user')) || { role: 'USER' };
  const isAdmin = user.role === 'ADMIN'; // Only Admin has control

  // 2. Mock Data State
  const [products, setProducts] = useState([
    { id: 1, name: "Royal Canin Puppy", price: "$45.00", category: "Food", rating: 4.8, img: "https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&w=300&q=80" },
    { id: 2, name: "Chew Toy Bone", price: "$12.50", category: "Toys", rating: 4.5, img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=300&q=80" },
    { id: 3, name: "Flea Drops (3-Pack)", price: "$28.00", category: "Medicine", rating: 4.9, img: "https://images.unsplash.com/photo-1623945535311-53697a544834?auto=format&fit=crop&w=300&q=80" },
    { id: 4, name: "Cat Scratch Post", price: "$85.00", category: "Furniture", rating: 4.7, img: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=300&q=80" },
    { id: 5, name: "Dog Bed (Large)", price: "$60.00", category: "Furniture", rating: 4.6, img: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=300&q=80" },
    { id: 6, name: "Rubber Ball", price: "$5.00", category: "Toys", rating: 4.2, img: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=300&q=80" },
  ]);

  const [cartCount, setCartCount] = useState(2);

  // Admin Actions
  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to remove this product?")) {
        setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Marketplace</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Browse best-selling pet supplies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Admin Control: Add Product */}
          {isAdmin && (
             <button className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" /> Add Product
             </button>
          )}

          {/* Cart Button (Visible to Non-Admins mainly, but Admins can see it too) */}
          <button className="relative p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                {cartCount}
                </span>
            )}
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex gap-4">
        <div className="relative flex-1">
           <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search for food, toys, medicine..." 
             className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-900 dark:text-white"
           />
        </div>
        <button className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300">
           <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
            <div key={p.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            
            {/* Image Area */}
            <div className="h-48 bg-slate-100 dark:bg-slate-700 relative overflow-hidden shrink-0">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                {/* Badge */}
                <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide">
                    {p.category}
                </span>

                {/* Hover Action Button (Add to Cart for Users/Vets) */}
                {!isAdmin && (
                    <button 
                        onClick={() => setCartCount(c => c + 1)}
                        className="absolute bottom-3 right-3 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-emerald-500 hover:text-white text-slate-700 dark:text-white"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                )}
            </div>
            
            {/* Info Area */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center text-amber-400 text-xs font-bold gap-1">
                        <Star className="w-3 h-3 fill-current" /> {p.rating}
                    </div>
                </div>
                
                <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate">{p.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 mb-4">{p.price}</p>

                {/* Admin Controls (Only visible to Admin) */}
                {isAdmin ? (
                    <div className="mt-auto grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600">
                            <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button 
                            onClick={() => handleDelete(p.id)}
                            className="flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                            <Trash2 className="w-3 h-3" /> Remove
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setCartCount(c => c + 1)}
                        className="mt-auto w-full py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                    >
                        Add to Cart
                    </button>
                )}
            </div>
            </div>
        ))}
      </div>

    </div>
  );
};

export default Marketplace;