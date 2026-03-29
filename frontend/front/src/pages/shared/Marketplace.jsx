import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Search, PlusCircle, X, ChevronRight, 
  SlidersHorizontal, Package, Tag, ArrowRight, Minus, Plus, Star, Image as ImageIcon, UploadCloud
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API } from '../../config/api';
import ProductCard from '../../components/shared/ProductCard';
import { useCart } from '../../context/CartContext'; // ✅ IMPORT CONTEXT

const BASE_URL = API.BASE_URL;
const API_BASE = API.BASE_API;

const Marketplace = () => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user')) || { role: 'USER' };
  const isAdmin = currentUser.role?.toUpperCase() === 'ADMIN';
  const portalPath = currentUser.role?.toUpperCase() === 'VETERINARIAN' || currentUser.role?.toUpperCase() === 'VET' ? 'vet' : 'owner';

  // ✅ USE GLOBAL CART
  const { cart, addToCart, updateQty, removeFromCart, cartTotal, cartItemCount } = useCart();

  // --- STATE ---
  const [products, setProducts] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState('All');
  const [sortBy, setSortBy] = useState('popular'); 
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modals
  const [modalMode, setModalMode] = useState(null); 
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', brand: 'Royal Canin', category: 'Nutrition', price: '', originalPrice: '', stockQuantity: '', description: '', badge: '', image: '' });
  
  // Image Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = ['All', 'Nutrition', 'Pharmacy', 'Accessories', 'Toys', 'Grooming'];
  const brands = ['Royal Canin', 'Pedigree', 'Drools', 'Himalaya', 'Other'];
  const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

  // ==========================================
  // API INTEGRATION (REAL DATA)
  // ==========================================
  
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map(p => ({
            ...p,
            image: p.image?.startsWith('/uploads') ? `${BASE_URL}${p.image}` : p.image
        }));
        setProducts(formattedData);
      }
    } catch (error) {
      toast.error("Failed to connect to database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- ADMIN ACTIONS ---
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        toast.error("File is too large (max 5MB)");
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const openAddModal = () => { 
    setFormData({ name: '', brand: 'Royal Canin', category: 'Nutrition', price: '', originalPrice: '', stockQuantity: '', description: '', badge: '', image: '' }); 
    setSelectedFile(null); 
    setImagePreview(null);
    setModalMode('ADD'); 
  };
  
  const openEditModal = (product) => { 
    setFormData({ ...product, originalPrice: product.originalPrice || '' }); 
    setEditingId(product.id); 
    setSelectedFile(null); 
    setImagePreview(null); 
    setModalMode('EDIT'); 
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if(!token) return toast.error("Session expired");

    const data = new FormData();
    if (selectedFile) data.append('file', selectedFile);
    
    const payload = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stockQuantity: parseInt(formData.stockQuantity) || 0,
      inStock: parseInt(formData.stockQuantity) > 0,
      description: formData.description || '',
      badge: formData.badge || '',
      image: formData.image || '', 
      features: [] 
    };
    
    data.append('product', JSON.stringify(payload));

   const url = modalMode === 'ADD' ? `${API_BASE}/products` : `${API_BASE}/products/${editingId}`;
    const method = modalMode === 'ADD' ? 'POST' : 'PUT';

    const loadingToast = toast.loading(`${modalMode === 'ADD' ? 'Adding' : 'Updating'} product...`);

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (response.ok) {
        toast.success(modalMode === 'ADD' ? "Product Added Successfully" : "Product Updated Successfully", { id: loadingToast });
        setModalMode(null);
        setSelectedFile(null);
        setImagePreview(null);
        fetchProducts(); 
      } else {
        const errorText = await response.text();
        toast.error(`Action failed: ${errorText || 'Server Error'}`, { id: loadingToast });
      }
    } catch (error) {
      toast.error("Network error.", { id: loadingToast });
    }
  };

  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Delete this product permanently?")) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
        toast.success("Product Removed");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) { toast.error("Network error"); }
  };

  const handleToggleStock = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}/products/${id}/toggle-stock`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        const formattedProduct = {
            ...updatedProduct,
            image: updatedProduct.image?.startsWith('/uploads') ? `${BASE_URL}${updatedProduct.image}` : updatedProduct.image
        };
        setProducts(products.map(p => p.id === id ? formattedProduct : p));
        toast.success("Inventory updated");
      }
    } catch (error) { toast.error("Network error"); }
  };

  // --- FILTERING & SORTING ---
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
      if (selectedRating > 0 && (p.rating || 5) < selectedRating) return false;
      if (availability === 'In Stock' && (!p.inStock || p.stockQuantity === 0)) return false;
      if (availability === 'Out of Stock' && p.inStock && p.stockQuantity > 0) return false;
      return true;
    });

    if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'popular') result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    if (sortBy === 'highest_rated') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'newest') result.sort((a, b) => b.id - a.id);
    return result;
  }, [products, searchTerm, selectedCategory, selectedBrands, selectedRating, availability, sortBy]);

  const dealsOfTheWeek = products.filter(p => p.badge && p.badge.includes('-'));

  // --- USER ACTIONS ---
  const handleBrandToggle = (brand) => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  const handleToggleWishlist = (id) => setProducts(products.map(p => p.id === id ? { ...p, isWishlisted: !p.isWishlisted } : p));

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-12">
      
      {/* HEADER & CART */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Marketplace</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{isAdmin ? 'Manage products, inventory, and listings.' : 'Buy trusted pet supplies and medicines.'}</p>
        </div>
        
        {isAdmin ? (
            <button onClick={openAddModal} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-300">
                <PlusCircle className="w-5 h-5" /> Add New Product
            </button>
        ) : (
            <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold shadow-xl hover:scale-105 transition-all duration-300">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount === 0 ? '🛒 0 Items' : `🛒 ${cartItemCount} Items • ${formatINR(cartTotal)}`}
            </button>
        )}
      </div>

      {/* DEALS SECTION */}
      {!isLoading && !searchTerm && selectedCategory === 'All' && dealsOfTheWeek.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Tag className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Deals of the Week</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dealsOfTheWeek.map(p => (
              <ProductCard key={`deal-${p.id}`} product={p} isAdmin={isAdmin} onAddToCart={addToCart} onEdit={openEditModal} onDelete={handleDeleteProduct} onToggleStock={handleToggleStock} onToggleWishlist={handleToggleWishlist} />
            ))}
          </div>
          <hr className="border-slate-200 dark:border-slate-800 my-10" />
        </div>
      )}

      {/* --- MARKETPLACE TOOLBAR --- */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
           <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
           <input type="text" placeholder="Search inventory..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all" />
        </div>
        
        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full md:w-auto py-2.5 px-4 text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/50 transition-all">
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="highest_rated">Highest Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* --- SIDEBAR FILTERS --- */}
        <div className={`w-full lg:w-64 shrink-0 space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-8">
            
            {/* CATEGORY */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-3 uppercase text-xs tracking-wider">Category</h3>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>{cat}</button>
                ))}
              </div>
            </div>

            {/* BRAND */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-3 uppercase text-xs tracking-wider">Brand</h3>
              <div className="space-y-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandToggle(brand)} className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* RATING */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-3 uppercase text-xs tracking-wider">Customer Rating</h3>
              <div className="space-y-2">
                {[4, 3].map(stars => (
                  <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="rating" checked={selectedRating === stars} onChange={() => setSelectedRating(stars)} className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600" />
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                      {Array.from({length: 5}).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />)}
                      <span className="ml-2">& Up</span>
                    </div>
                  </label>
                ))}
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="rating" checked={selectedRating === 0} onChange={() => setSelectedRating(0)} className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">Any Rating</span>
                </label>
              </div>
            </div>

            {/* AVAILABILITY */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-3 uppercase text-xs tracking-wider">Availability</h3>
              <div className="space-y-2">
                {['All', 'In Stock', 'Out of Stock'].map(status => (
                  <label key={status} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="availability" checked={availability === status} onChange={() => setAvailability(status)} className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="flex-1 w-full">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium tracking-wider animate-pulse">Loading Inventory...</p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl bg-white dark:bg-slate-800 shadow-sm">
                <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No products found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters or search term.</p>
                <button onClick={() => {setSearchTerm(''); setSelectedCategory('All'); setSelectedBrands([]); setSelectedRating(0); setAvailability('All');}} className="mt-6 px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl hover:scale-105 transition-transform">Clear All Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                 <ProductCard key={product.id} product={product} isAdmin={isAdmin} onAddToCart={addToCart} onEdit={openEditModal} onDelete={handleDeleteProduct} onToggleStock={handleToggleStock} onToggleWishlist={handleToggleWishlist} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- ADD / EDIT PRODUCT MODAL (Admin Only) --- */}
      {isAdmin && modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200 dark:border-slate-700">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">{modalMode === 'ADD' ? 'Add New Product' : 'Edit Product'}</h2>
                      <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5"/></button>
                  </div>
                  <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</label>
                          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brand</label>
                              <select value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none">
                                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none">
                                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                          </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price (₹)</label>
                              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">MRP (Optional)</label>
                              <input type="number" placeholder="Original Price" value={formData.originalPrice || ''} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Qty</label>
                              <input required type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Badge (Optional)</label>
                              <select value={formData.badge || ''} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none">
                                  <option value="">None</option>
                                  <option value="Best Seller">Best Seller</option>
                                  <option value="Trending">Trending</option>
                                  <option value="New Arrival">New Arrival</option>
                                  <option value="-10%">-10% Deal</option>
                                  <option value="-20%">-20% Deal</option>
                              </select>
                          </div>
                          
                          {/* Image Upload Zone */}
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Image</label>
                              <div className="flex gap-4 items-center mt-1">
                                {imagePreview || formData.image ? (
                                    <div className="relative w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1 shrink-0 flex items-center justify-center">
                                      <img src={imagePreview || (formData.image?.startsWith('/uploads') ? `${BASE_URL}${formData.image}` : formData.image)} alt="Preview" className="max-h-full object-contain" />
                                      <button type="button" onClick={() => { setSelectedFile(null); setImagePreview(null); setFormData({...formData, image: ''}); }} className="absolute -top-2 -right-2 p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700 active:scale-95 transition-all"><X size={14} /></button>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2 shrink-0 flex items-center justify-center text-slate-400">
                                        <ImageIcon size={24} />
                                    </div>
                                )}
                                <label className="flex-1 text-center py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2">
                                  <UploadCloud size={16} /> {selectedFile ? 'Change File' : 'Upload Image'}
                                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>
                              </div>
                          </div>

                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" rows="3"></textarea>
                      </div>
                      <div className="flex gap-4 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 z-10 bg-white dark:bg-slate-900">
                        <button type="button" onClick={() => setModalMode(null)} className="w-1/3 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                        <button type="submit" className="w-2/3 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-transform">{modalMode === 'ADD' ? 'Add Product' : 'Save Changes'}</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* --- USER CART SLIDE-OVER --- */}
      {!isAdmin && isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>

              <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
                  <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-indigo-600" /> Shopping Cart</h2>
                      <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all"><X className="w-5 h-5" /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {cart.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2"><ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-600" /></div>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">Your cart is empty</p>
                            <button onClick={() => setIsCartOpen(false)} className="mt-4 text-indigo-600 font-bold hover:underline">Start Shopping</button>
                          </div>
                      ) : (
                          cart.map((item) => (
                              <div key={item.id} className="flex gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm relative group hover:shadow-md transition-shadow">
                                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 p-2 shrink-0 flex items-center justify-center">
                                    <img src={item.image} alt={item.name} className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                  </div>
                                  <div className="flex-1 flex flex-col justify-between">
                                      <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 pr-6">{item.name}</h4>
                                      <button onClick={() => removeFromCart(item.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><X className="w-5 h-5"/></button>
                                      <div className="flex justify-between items-end mt-3">
                                          <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                                              <button onClick={() => updateQty(item.id, -1)} className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-md transition-colors"><Minus className="w-3 h-3"/></button>
                                              <span className="text-xs font-bold w-8 text-center text-slate-900 dark:text-white">{item.qty}</span>
                                              <button onClick={() => updateQty(item.id, 1)} className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-md transition-colors"><Plus className="w-3 h-3"/></button>
                                          </div>
                                          <span className="font-extrabold text-indigo-600 text-lg">{formatINR(item.price * item.qty)}</span>
                                      </div>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>

                  {cart.length > 0 && (
                      <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                          <div className="flex justify-between text-xl font-black mb-6"><span className="text-slate-900 dark:text-white">Total</span><span className="text-indigo-600">{formatINR(cartTotal)}</span></div>
                          <button 
                            onClick={() => { setIsCartOpen(false); navigate(`/${portalPath}/checkout`, { state: { cart, cartTotal } }); }} 
                            className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:scale-[1.02] transition-transform flex justify-center items-center gap-2"
                          >
                              Proceed to Checkout <ArrowRight className="w-5 h-5" />
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