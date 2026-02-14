import React from 'react';
import { Calendar, Bell, Activity, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Good Morning, Aditya! ☀️
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here is what's happening with your furry friends today.</p>
        </div>
        <button 
          onClick={() => navigate('/owner/appointments/book')}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
        >
          + Book Appointment
        </button>
      </div>

      {/* 2. Overview Grid (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Next Appointment */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded text-white">TOMORROW</span>
            </div>
            <h3 className="text-2xl font-bold">Dr. Sarah Smith</h3>
            <p className="text-indigo-100 mt-1">General Checkup for Bella</p>
            <p className="text-sm font-medium mt-4 opacity-90">10:00 AM • City Vet Clinic</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
        </div>

        {/* KPI 2: Health Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <Bell className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">1</span>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">Action Required</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Luna's vaccination is overdue by 3 days.</p>
          <button className="text-sm font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1">
            Schedule Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* KPI 3: Active Pets */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <Heart className="w-6 h-6 text-pink-500" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">2</span>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">Your Pets</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Bella is healthy. Luna needs attention.</p>
          <button onClick={() => navigate('/owner/pets')} className="text-sm font-medium text-cyan-600 hover:text-cyan-700">View All Pets →</button>
        </div>
      </div>

      {/* 3. Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3): Activity & Marketplace */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-500" /> Recent Activity
              </h3>
            </div>
            {[1, 2, 3].map((item, idx) => (
              <div key={idx} className="p-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-2xl">
                  {idx === 0 ? '💉' : idx === 1 ? '🛒' : '📅'}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {idx === 0 ? 'Vaccination Completed' : idx === 1 ? 'Food Order Shipped' : 'Checkup Scheduled'}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {idx === 0 ? 'Bella received Rabies shot.' : idx === 1 ? 'Premium Dog Food (10kg)' : 'Upcoming for Luna'}
                  </p>
                </div>
                <span className="text-xs font-medium text-gray-400">2h ago</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-md">
              <div className="flex items-center gap-2 mb-4 text-cyan-400">
                <ShoppingBag className="w-5 h-5" />
                <span className="text-xs font-bold tracking-widest uppercase">Pet Marketplace</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Treat your pets to the best.</h3>
              <p className="text-gray-300 mb-6">Get 20% off on your first order.</p>
              <button onClick={() => navigate('/owner/marketplace')} className="bg-white text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-cyan-500/20 to-transparent"></div>
          </div>
        </div>

        {/* Right Column (1/3): Quick Widgets */}
        <div className="space-y-6">
           <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl p-5 border border-cyan-100 dark:border-cyan-800/30">
            <h3 className="font-bold text-cyan-900 dark:text-cyan-100 mb-2">Did you know?</h3>
            <p className="text-sm text-cyan-800 dark:text-cyan-200 leading-relaxed">
              Cats need high-protein diets because they are obligate carnivores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;