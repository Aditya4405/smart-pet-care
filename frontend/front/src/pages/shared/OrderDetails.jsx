import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, Package, Truck, CheckCircle2, Clock, 
  MapPin, CreditCard, XCircle, User, ClipboardList, PackageCheck 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API } from '../../config/api';

const BASE_URL = API.BASE_URL;
const API_BASE = API.BASE_API;

const OrderDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialOrder = location.state?.order;
  const currentUser = JSON.parse(localStorage.getItem('user')) || { role: 'USER' };
  const isAdmin = currentUser.role?.toUpperCase() === 'ADMIN';

  const [order, setOrder] = useState(initialOrder);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialOrder); // ✅ Added Loading State

  const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

  // ✅ NEW: Fetch order if it wasn't passed in location state (e.g., from Confirmation page or Page Refresh)
  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const token = localStorage.getItem('token');
          // Fetch from admin pool if admin, otherwise user pool
          const endpoint = isAdmin ? `${API_BASE}/orders/admin/all` : `${API_BASE}/orders/user/${currentUser.id}`;
          
          const response = await fetch(endpoint, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const orders = await response.json();
            // Find the specific order matching our URL ID
            const foundOrder = orders.find(o => String(o.id) === String(id));
            if (foundOrder) {
              setOrder(foundOrder);
            }
          }
        } catch (error) {
          console.error("Failed to fetch order:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, isAdmin, currentUser.id, order]);

  // ✅ NEW: Show spinner while fetching
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32 animate-in fade-in">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in fade-in">
        <Package size={64} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Order Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-6 text-indigo-600 font-bold hover:underline">Go Back</button>
      </div>
    );
  }

  // --- TRACKING STEPPER DATE LOGIC ---
  const getStepIndex = (status) => {
    const s = status?.toUpperCase();
    if (s === 'DELIVERED') return 3;
    if (s === 'SHIPPED') return 2;
    if (s === 'PAID') return 1; 
    return 0; // Default to Placed
  };

  const currentStepIndex = getStepIndex(order.status);
  const isCancelled = order.status?.toUpperCase() === 'CANCELLED';

  // Calculate Dates based on Order Date
  const orderDateObj = new Date(order.orderDate || new Date());
  
  const formatDate = (date, daysToAdd = 0) => {
    const d = new Date(date);
    d.setDate(d.getDate() + daysToAdd);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const trackingSteps = [
    { 
      id: 'PLACED', 
      label: 'Order Placed', 
      icon: ClipboardList, 
      dateText: formatDate(orderDateObj, 0) 
    },
    { 
      id: 'PAID', 
      label: 'Processing', 
      icon: PackageCheck, 
      dateText: currentStepIndex >= 1 ? formatDate(orderDateObj, 1) : `Est. ${formatDate(orderDateObj, 1)}` 
    },
    { 
      id: 'SHIPPED', 
      label: 'Shipped', 
      icon: Truck, 
      dateText: currentStepIndex >= 2 ? formatDate(orderDateObj, 2) : `Est. ${formatDate(orderDateObj, 2)}` 
    },
    { 
      id: 'DELIVERED', 
      label: 'Delivered', 
      icon: CheckCircle2, 
      dateText: currentStepIndex >= 3 ? formatDate(orderDateObj, 5) : `Expected by ${formatDate(orderDateObj, 5)}` 
    }
  ];

  // Dynamic Icon & Styling for Header Badge
  const getStatusConfig = (status) => {
    switch(status?.toUpperCase()) {
      case 'PAID': return { icon: Clock, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20' };
      case 'SHIPPED': return { icon: Truck, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20' };
      case 'DELIVERED': return { icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20' };
      case 'CANCELLED': return { icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/20' };
      default: return { icon: Package, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700' };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  // Admin Action: Update Order Status
  const handleUpdateStatus = async (newStatus) => {
    if (!isAdmin) return;
    setIsUpdating(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE}/orders/admin/${order.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder); 
        toast.success(`Order marked as ${newStatus}`);
      } else {
        toast.error("Failed to update order status.");
      }
    } catch (error) {
      toast.error("Network error.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              Order #{order.id}
            </h1>
            <p className="text-sm text-slate-500">Placed on {new Date(order.orderDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
          </div>
        </div>

        {/* Current Status Badge */}
        <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
          <StatusIcon size={16} /> 
          {order.status?.toUpperCase() === 'PAID' ? 'PROCESSING' : order.status}
        </div>
      </div>

      {/* --- VISUAL ORDER TRACKER WITH DATES --- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 mb-8 overflow-x-auto">
        <h2 className="font-bold text-slate-900 dark:text-white mb-8">Tracking Details</h2>
        
        {isCancelled ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-500/20 font-bold">
            <XCircle size={24} />
            This order has been cancelled and refunded.
          </div>
        ) : (
          <div className="relative min-w-[600px]">
            {/* Background Line */}
            <div className="absolute top-6 left-12 right-12 h-1 bg-slate-100 dark:bg-slate-700 rounded-full z-0"></div>
            
            {/* Active Progress Line */}
            <div 
              className="absolute top-6 left-12 h-1 bg-indigo-500 rounded-full z-0 transition-all duration-700 ease-in-out"
              style={{ width: `calc(${(currentStepIndex / (trackingSteps.length - 1)) * 100}% - ${currentStepIndex === 0 ? '0px' : '3rem'})` }} 
            ></div>

            <div className="relative z-10 flex justify-between">
              {trackingSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isActive = index === currentStepIndex;
                
                return (
                  <div key={step.id} className="flex flex-col items-center w-1/4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm transition-colors duration-500 z-10 ${isCompleted ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                      <step.icon size={20} />
                    </div>
                    <div className="mt-4 text-center">
                      <p className={`font-bold text-sm ${isActive ? 'text-indigo-600 dark:text-indigo-400' : isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {step.label}
                      </p>
                      {/* DATES ADDED HERE */}
                      <p className={`text-xs mt-1 font-medium ${isActive ? 'text-indigo-500/80 animate-pulse' : 'text-slate-500 dark:text-slate-400'}`}>
                        {step.dateText}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Package size={18} className="text-indigo-500"/> Purchased Items</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {order.items?.map((item) => (
                <div key={item.id} className="p-5 flex items-center gap-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-2 shrink-0 flex items-center justify-center">
                    <img 
                      src={item.image?.startsWith('/uploads') ? `${BASE_URL}${item.image}` : item.image} 
                      alt={item.productName} 
                      className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight mb-1">{item.productName}</h3>
                    <p className="text-sm text-slate-500">Qty: <span className="font-bold text-slate-700 dark:text-slate-300">{item.quantity}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-slate-900 dark:text-white text-lg">{formatINR(item.priceAtPurchase * item.quantity)}</p>
                    <p className="text-xs text-slate-400">{formatINR(item.priceAtPurchase)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Details & Admin Controls */}
        <div className="space-y-6">
          
          {/* Admin Fulfillment Controls */}
          {isAdmin && (
            <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl shadow-sm border border-indigo-200 dark:border-indigo-500/20 p-6">
              <h2 className="font-bold text-indigo-900 dark:text-indigo-400 mb-4 flex items-center gap-2">Admin Fulfillment</h2>
              <p className="text-xs text-indigo-600 dark:text-indigo-300 mb-3">Update the status of this order:</p>
              <select 
                value={order.status} 
                onChange={(e) => handleUpdateStatus(e.target.value)}
                disabled={isUpdating}
                className="w-full p-3 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer disabled:opacity-50"
              >
                <option value="PLACED">Placed (Unpaid)</option>
                <option value="PAID">Paid (Processing)</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5 pb-5 border-b border-slate-100 dark:border-slate-700">
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400"><span>Item Subtotal</span><span>{formatINR(order.totalAmount)}</span></div>
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400"><span>Shipping</span><span className="text-emerald-500 font-bold">FREE</span></div>
            </div>
            <div className="flex justify-between text-xl font-black text-slate-900 dark:text-white">
              <span>Total</span><span className="text-indigo-600 dark:text-indigo-400">{formatINR(order.totalAmount)}</span>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><User size={14}/> Customer</h3>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{order.customerName}</p>
              <p className="text-sm text-slate-500">{order.userEmail}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><MapPin size={14}/> Shipping Address</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{order.shippingAddress}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><CreditCard size={14}/> Payment Method</h3>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{order.paymentMethod}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;