import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { API } from '../../config/api';

const BASE_URL = API.BASE_URL;
const API_BASE = API.BASE_API;

const Orders = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user')) || { role: 'USER', id: 1 };
  const isAdmin = currentUser.role?.toUpperCase() === 'ADMIN';
  
  // Set correct portal path so clicking works for Admins, Vets, and Owners
  const portalPath = isAdmin ? 'admin' : (currentUser.role?.toUpperCase() === 'VETERINARIAN' || currentUser.role?.toUpperCase() === 'VET' ? 'vet' : 'owner');

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Choose the endpoint based on user role (Admin sees all, User sees theirs)
        const endpoint = isAdmin 
            ? `${API_BASE}/orders/admin/all`
            : `${API_BASE}/orders/user/${currentUser.id}`;

        const response = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          toast.error("Failed to load order history.");
        }
      } catch (error) {
        toast.error("Network error while fetching orders.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser.id, isAdmin]);

  const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  
  // Dynamic Badge for Order Status
  const getStatusBadge = (status) => {
    switch(status?.toUpperCase()) {
      case 'PAID': 
        return <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex items-center gap-1.5 border border-blue-200 dark:border-blue-500/20"><Clock size={12}/> Processing</span>;
      case 'SHIPPED': 
        return <span className="px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold flex items-center gap-1.5 border border-amber-200 dark:border-amber-500/20"><Truck size={12}/> Shipped</span>;
      case 'DELIVERED': 
        return <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-500/20"><CheckCircle2 size={12}/> Delivered</span>;
      case 'CANCELLED': 
        return <span className="px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-bold flex items-center gap-1.5 border border-red-200 dark:border-red-500/20"><XCircle size={12}/> Cancelled</span>;
      default: 
        return <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
          <Package size={24} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isAdmin ? 'Platform Order Fulfillment' : 'My Orders'}
        </h1>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium tracking-wide">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-16 flex flex-col items-center text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">No orders found</h2>
          <p className="text-slate-500 mb-8 max-w-sm">There are currently no orders to display.</p>
          {!isAdmin && (
            <button onClick={() => navigate(`/${portalPath}/marketplace`)} className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform">Start Shopping</button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div 
              key={order.id} 
              onClick={() => navigate(`/${portalPath}/orders/${order.id}`, { state: { order } })}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group" 
            >
              {/* Order Header */}
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Order #{order.id} • {new Date(order.orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="font-extrabold text-slate-900 dark:text-white text-lg">
                    {order.items?.length || 0} Items • <span className="text-indigo-600 dark:text-indigo-400">{formatINR(order.totalAmount)}</span>
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  {getStatusBadge(order.status)}
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                  </div>
                </div>
              </div>
              
              {/* Items Preview */}
              <div className="p-5 sm:p-6">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Ship to: <span className="text-slate-900 dark:text-slate-300">{order.customerName}</span></p>
                <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="w-20 h-20 shrink-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center relative group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30 transition-colors tooltip-trigger">
                      <img 
                        src={item.image?.startsWith('/uploads') ? `${BASE_URL}${item.image}` : item.image} 
                        alt="Product" 
                        className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" 
                      />
                      {item.quantity > 1 && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">x{item.quantity}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;