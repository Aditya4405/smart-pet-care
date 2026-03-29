import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Calendar, CreditCard, Receipt } from 'lucide-react';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const { orderId = 'ORD-123456', grandTotal = 0, paymentMethod = 'UPI', expectedDelivery = 'Pending' } = state || {};

  const currentUser = JSON.parse(localStorage.getItem('user')) || { role: 'USER' };
  const portalPath = currentUser.role?.toUpperCase() === 'VETERINARIAN' || currentUser.role?.toUpperCase() === 'VET' ? 'vet' : 'owner';

  const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-in fade-in duration-500 pt-10">
      
      {/* Banner Area */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-t-3xl p-10 text-center relative overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 border-b-0">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 ring-4 ring-white/30">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Order Confirmed!</h1>
          <p className="text-emerald-100 dark:text-slate-300 text-lg">Thank you for shopping with SmartPetCare.</p>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-b-3xl p-8 -mt-2 relative z-20">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Order Summary</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-indigo-500 border border-slate-100 dark:border-slate-700"><Receipt className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Order ID</p>
              <p className="font-bold text-slate-900 dark:text-white text-lg">{orderId}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-emerald-500 border border-slate-100 dark:border-slate-700"><CreditCard className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount Paid</p>
              <p className="font-bold text-slate-900 dark:text-white text-lg">{formatINR(grandTotal)} <span className="text-sm text-slate-400 font-normal">via {paymentMethod.toUpperCase()}</span></p>
            </div>
          </div>
          <div className="flex items-start gap-4 sm:col-span-2">
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-amber-500 border border-slate-100 dark:border-slate-700"><Calendar className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Expected Delivery</p>
              <p className="font-bold text-slate-900 dark:text-white text-lg">{expectedDelivery}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">We will send a tracking link once your order is shipped.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-slate-700">
          <button 
            // ✅ UPDATED THIS LINE: Added `{ state: { order: state?.order } }`
            onClick={() => navigate(`/${portalPath}/orders/${orderId}`, { state: { order: state?.order } })}
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" /> Track Order
          </button>
          <button 
            onClick={() => navigate(`/${portalPath}/marketplace`)}
            className="flex-1 py-4 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default OrderConfirmation;