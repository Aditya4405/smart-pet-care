import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Truck, ChevronLeft, ShieldCheck, CheckCircle2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { API } from '../../config/api';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Grab the cart data passed from Marketplace
  const { cart = [], cartTotal = 0 } = location.state || {};

  const currentUser = JSON.parse(localStorage.getItem('user')) || { role: 'USER', id: 1 };
  const portalPath = currentUser.role?.toUpperCase() === 'VETERINARIAN' || currentUser.role?.toUpperCase() === 'VET' ? 'vet' : 'owner';

  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser.firstName + " " + (currentUser.lastName || '') || '',
    email: currentUser.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'Razorpay'
  });

  const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

  // If someone navigates to /checkout directly without a cart, send them back
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in">
        <ShoppingCart size={64} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your cart is empty</h2>
        <button onClick={() => navigate(`/${portalPath}/marketplace`)} className="mt-6 text-indigo-600 font-bold hover:underline">Return to Marketplace</button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- UPDATED: HANDLE RAZORPAY CHECKOUT ---
  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const token = localStorage.getItem('token');
    
    try {
      // 1. Create Order on Backend (using the payment controller)
      const res = await fetch(`${API.BASE_API}/payments/create-order`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ amount: cartTotal })
      });
      
      if (!res.ok) throw new Error("Order creation failed");
      const order = await res.json();

      // 2. Configure Razorpay Options
      const options = {
        key: "rzp_test_SQ0ta0U3p1xtRA", // REPLACE WITH YOUR ACTUAL KEY ID
        amount: order.amount,
        currency: "INR",
        name: "PetCare Store",
        description: "Payment for Pet Supplies",
        order_id: order.id, 
        handler: async function (paymentResponse) {
          // 3. This runs AFTER user pays successfully
          // Build the final ShopOrder payload
          const orderPayload = {
            userId: currentUser.id,
            customerName: formData.fullName,
            userEmail: formData.email,
            shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zipCode} (Phone: ${formData.phone})`,
            totalAmount: cartTotal,
            paymentMethod: "Razorpay",
            transactionId: paymentResponse.razorpay_payment_id,
            items: cart.map(item => ({
              productId: item.id,
              productName: item.name,
              quantity: item.qty,
              priceAtPurchase: item.price,
              image: item.image
            }))
          };

          const finalRes = await fetch(`${API.BASE_API}/orders/checkout`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(orderPayload)
          });

          if (finalRes.ok) {
            const savedOrder = await finalRes.json();
            toast.success("Order Placed Successfully!");
            navigate(`/${portalPath}/order-confirmation`, { state: { orderId: savedOrder.id, grandTotal: cartTotal, paymentMethod: 'Razorpay' } });
          } else {
            toast.error("Failed to save order in database.");
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed to initialize.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <ChevronLeft className="w-5 h-5 text-slate-500" />
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Secure Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Forms */}
        <div className="lg:col-span-7 space-y-6">
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
            
            {/* Shipping Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="text-indigo-500" /> Shipping Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                <input required type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                <input required type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 sm:col-span-2" />
                <input required type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 sm:col-span-2" />
                <input required type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                <div className="grid grid-cols-2 gap-4">
                   <input required type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                   <input required type="text" name="zipCode" placeholder="ZIP Code" value={formData.zipCode} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="text-indigo-500" /> Payment Method
              </h2>
              <div className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 flex items-center gap-3">
                 <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                 </div>
                 <span className="font-bold text-slate-900 dark:text-white">Razorpay (Secure Online Payment)</span>
              </div>
            </div>

          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-24">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Order Summary</h2>
            </div>
            
            <div className="p-6 space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0">
                    <img src={item.image} alt={item.name} className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {formatINR(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between text-slate-500 text-sm font-medium">
                <span>Subtotal</span><span>{formatINR(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-sm font-medium">
                <span>Shipping</span><span className="text-emerald-500 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-700">
                <span>Total</span><span className="text-indigo-600">{formatINR(cartTotal)}</span>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50">
              <button 
                type="submit" 
                form="checkout-form"
                disabled={isProcessing}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                ) : (
                  <><ShieldCheck className="w-5 h-5" /> Pay {formatINR(cartTotal)}</>
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500" /> Secure 256-bit SSL Encryption
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;