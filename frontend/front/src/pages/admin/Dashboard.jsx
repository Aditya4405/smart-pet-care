import React from 'react';
import { Calendar, Bell, Activity, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    // 5. Rhythm Spacing
    <div className="space-y-10 pb-16 animate-in slide-in-from-bottom-4 duration-700 fade-in">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {/* 4. Tight Typography */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Good Morning, Aditya! <span className="animate-wave inline-block origin-bottom-right delay-500">☀️</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium tracking-wide">
            Here is what's happening with your furry friends today.
          </p>
        </div>
        
        {/* 7. Premium Button */}
        <button 
          onClick={() => navigate('/owner/appointments')}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-[0_4px_14px_0_rgba(20,184,166,0.39)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.23)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {/* 2. Overview Grid (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {/* PRIMARY CARD (Highest Elevation) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-[0_20px_60px_-10px_rgba(99,102,241,0.4)] hover:scale-[1.02] transition-transform duration-300 ease-out group cursor-pointer">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
                <Calendar className="w-6 h-6 text-indigo-50" />
              </div>
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm rounded-full border border-white/10 text-indigo-50 shadow-sm">Tomorrow</span>
            </div>
            
            <div className="mt-8">
               <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">Dr. Sarah Smith</h3>
               <p className="text-indigo-100 font-medium mt-1 text-lg">General Checkup for Bella</p>
               <div className="mt-5 flex items-center gap-2 text-sm font-bold text-indigo-50/90 tracking-wide bg-indigo-900/20 w-fit px-3 py-1.5 rounded-lg border border-indigo-500/30">
                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                 10:00 AM • City Vet Clinic
               </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/15 transition-all duration-700"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/40 rounded-full blur-2xl"></div>
        </div>

        {/* STANDARD CARD (Medium Elevation) */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/50 group-hover:scale-110 transition-transform duration-300">
              <Bell className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tighter">1</span>
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Action Required</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6 leading-relaxed font-medium">
            Luna's vaccination is overdue by <span className="font-bold text-amber-600 dark:text-amber-400 border-b-2 border-amber-200">3 days</span>.
          </p>
          <button className="w-full py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-sm font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors flex items-center justify-center gap-1.5 group/btn">
            Schedule Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* STANDARD CARD */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-800/50 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tighter">2</span>
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Your Pets</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6 leading-relaxed font-medium">
            Bella is healthy. Luna needs attention.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
              <img className="w-10 h-10 rounded-full border-[3px] border-white dark:border-slate-800 shadow-md object-cover transform hover:scale-110 transition-transform z-10" src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=100&q=80" alt="Bella" />
              <img className="w-10 h-10 rounded-full border-[3px] border-white dark:border-slate-800 shadow-md object-cover transform hover:scale-110 transition-transform z-20" src="https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=100&q=80" alt="Luna" />
              <div className="w-10 h-10 rounded-full border-[3px] border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 z-0">+</div>
            </div>
            <button onClick={() => navigate('/owner/pets')} className="text-sm font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline decoration-2 underline-offset-4 decoration-teal-200">View All</button>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3): Activity & Marketplace */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Activity List */}
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2.5 tracking-tight">
                <Activity className="w-5 h-5 text-teal-500" /> Recent Activity
              </h3>
              <button className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-teal-600 transition-colors">View All</button>
            </div>
            
            {/* 6. List Interaction (Hover States & Dividers) */}
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {[1, 2, 3].map((item, idx) => (
                <div key={idx} className="p-5 flex items-center gap-5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors duration-200 cursor-default group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 dark:border-slate-700/50 group-hover:scale-105 transition-transform ${
                     idx === 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 
                     idx === 1 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 
                     'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                  }`}>
                    {idx === 0 ? '💉' : idx === 1 ? '🛒' : '📅'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                      {idx === 0 ? 'Vaccination Completed' : idx === 1 ? 'Food Order Shipped' : 'Checkup Scheduled'}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate font-medium">
                      {idx === 0 ? 'Bella received Rabies shot.' : idx === 1 ? 'Premium Dog Food (10kg)' : 'Upcoming for Luna'}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">2h ago</span>
                </div>
              ))}
            </div>
          </div>

          {/* Marketplace Promo Card (Secondary Surface) */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-black p-10 text-white shadow-2xl shadow-slate-900/20 border border-slate-800 group">
            <div className="relative z-10 max-w-lg">
              <div className="flex items-center gap-2 mb-5 text-teal-400">
                <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
                   <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase">Pet Marketplace</span>
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight leading-tight">Treat your pets to the best.</h3>
              <p className="text-slate-400 mb-8 text-lg font-normal leading-relaxed">
                Get <span className="text-white font-semibold border-b border-teal-500">20% off</span> on your first order of premium vet-approved food.
              </p>
              <button onClick={() => navigate('/owner/marketplace')} className="bg-white text-slate-900 px-8 py-3.5 rounded-xl font-bold hover:bg-teal-50 transition-all duration-200 shadow-lg shadow-white/10 hover:shadow-white/20 active:scale-95">
                Start Shopping
              </button>
            </div>
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-60"></div>
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] group-hover:bg-teal-500/30 transition-all duration-1000"></div>
          </div>

        </div>

        {/* Right Column (1/3): Quick Widgets */}
        <div className="space-y-8">
           
           {/* Tips Widget */}
           <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/40 rounded-2xl p-6 border border-teal-100 dark:border-teal-900/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all"></div>
             <h3 className="font-bold text-teal-900 dark:text-teal-100 mb-3 relative z-10 tracking-tight text-lg">Did you know?</h3>
             <p className="text-sm text-teal-800/90 dark:text-teal-200/80 leading-relaxed relative z-10 font-medium">
              Cats are obligate carnivores, meaning they need a high-protein diet to survive. Ensure Luna gets enough taurine!
             </p>
          </div>

           {/* Quick Actions List */}
           <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-5 text-xs uppercase tracking-widest opacity-70">Quick Actions</h3>
              <div className="space-y-3">
                {['Update Pet Profile', 'View Past Invoices', 'Contact Support'].map((action, i) => (
                  <button key={i} className="w-full text-left px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 shadow-sm text-sm font-semibold text-slate-600 dark:text-slate-300 transition-all flex justify-between items-center group active:scale-[0.98]">
                    {action}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-teal-500" />
                  </button>
                ))}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;