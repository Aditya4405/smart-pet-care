import React, { useState } from 'react';
import { Package, ShoppingCart, TrendingUp, Plus, Search, MoreHorizontal, AlertCircle } from 'lucide-react';

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Marketplace Manager</h1>
          <p className="text-slate-500 text-sm">Manage your clinic's inventory and orders.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {['overview', 'products', 'orders'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Switcher */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'products' && <ProductsTab />}
      {activeTab === 'orders' && <OrdersTab />}
    </div>
  );
};

// --- SUB-TABS ---

const OverviewTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in">
    <KpiCard title="Total Products" value="45" icon={Package} color="blue" />
    <KpiCard title="Orders Today" value="12" icon={ShoppingCart} color="emerald" />
    <KpiCard title="Revenue (Wk)" value="$1,250" icon={TrendingUp} color="indigo" />
    <KpiCard title="Low Stock" value="3" icon={AlertCircle} color="amber" />
  </div>
);

const ProductsTab = () => {
  const products = [
    { id: 1, name: 'Royal Canin Dog Food', category: 'Food', price: '$45.00', stock: 24, status: 'In Stock' },
    { id: 2, name: 'Anti-Flea Drops', category: 'Medicine', price: '$12.50', stock: 5, status: 'Low Stock' },
    { id: 3, name: 'Chew Toy Bone', category: 'Toys', price: '$8.00', stock: 0, status: 'Out of Stock' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search products..." className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-lg">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700/50 uppercase text-xs text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{p.name}</td>
                <td className="px-6 py-4 text-slate-500">{p.category}</td>
                <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">{p.price}</td>
                <td className="px-6 py-4 text-slate-700">{p.stock} units</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    p.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 
                    p.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrdersTab = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center animate-in fade-in">
    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
      <ShoppingCart className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No active orders</h3>
    <p className="text-slate-500 text-sm mt-1">Orders from pet owners will appear here.</p>
  </div>
);

// Helper
const KpiCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600"
  };
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${colors[color]}`}><Icon className="w-5 h-5" /></div>
      </div>
    </div>
  );
};

export default Marketplace;