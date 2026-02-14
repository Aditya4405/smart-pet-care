import React from 'react';
import { 
  Calendar, Users, Clock, DollarSign, ArrowUpRight, 
  MoreHorizontal, CheckCircle, XCircle 
} from 'lucide-react';

const VetDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { firstName: 'Aditya', lastName: 'Prajapati' };

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dr. {user.lastName}'s Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium tracking-wide">
            Here's an overview of your practice today.
          </p>
        </div>
        
        <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
          Manage Schedule
        </button>
      </div>

      {/* 2. KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Appointments Today" 
          value="8" 
          trend="+12%" 
          icon={Calendar} 
          color="blue" 
        />
        <StatCard 
          title="Total Patients" 
          value="1,240" 
          trend="+4%" 
          icon={Users} 
          color="indigo" 
        />
        <StatCard 
          title="Pending Requests" 
          value="3" 
          trend="0%" 
          icon={Clock} 
          color="amber" 
        />
        <StatCard 
          title="Earnings (Today)" 
          value="$450" 
          trend="+8%" 
          icon={DollarSign} 
          color="emerald" 
        />
      </div>

      {/* 3. Main Split: Schedule vs Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Today's Schedule (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-slate-900 dark:text-white text-lg">Today's Schedule</h3>
               <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">View Calendar</button>
            </div>

            <div className="space-y-4">
              <AppointmentRow 
                time="10:00 AM" 
                patient="Bella" 
                owner="Aditya" 
                type="Checkup" 
                status="Confirmed" 
                img="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=100&q=80"
              />
              <AppointmentRow 
                time="11:30 AM" 
                patient="Rocky" 
                owner="Rahul" 
                type="Vaccination" 
                status="Pending" 
                img="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=100&q=80"
              />
              <AppointmentRow 
                time="02:00 PM" 
                patient="Max" 
                owner="Priya" 
                type="Surgery" 
                status="Confirmed" 
                img="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=100&q=80"
              />
               <AppointmentRow 
                time="04:15 PM" 
                patient="Luna" 
                owner="Sneha" 
                type="Dental Cleaning" 
                status="Confirmed" 
                img="https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=100&q=80"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Weekly Earnings Graph (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-sm h-full">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6">Weekly Earnings</h3>
            
            {/* Custom CSS Bar Chart */}
            <div className="flex items-end justify-between h-64 gap-2 mt-4">
               <Bar height="40%" day="Mon" value="$400" />
               <Bar height="30%" day="Tue" value="$300" />
               <Bar height="55%" day="Wed" value="$550" />
               <Bar height="45%" day="Thu" value="$450" />
               <Bar height="60%" day="Fri" value="$600" />
               <Bar height="85%" day="Sat" value="$850" highlight />
               <Bar height="20%" day="Sun" value="$200" />
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
               <div className="flex justify-between items-center">
                  <div>
                     <p className="text-xs text-slate-500 font-bold uppercase">Total this week</p>
                     <p className="text-2xl font-bold text-slate-900 dark:text-white">$3,350</p>
                  </div>
                  <div className="text-right">
                     <p className="text-xs text-slate-500 font-bold uppercase">Growth</p>
                     <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        <ArrowUpRight className="w-4 h-4" /> 12.5%
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const StatCard = ({ title, value, trend, icon: Icon, color }) => {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-bold text-emerald-600 flex items-center">
          <ArrowUpRight className="w-4 h-4" /> {trend}
        </span>
        <span className="text-slate-400">vs last month</span>
      </div>
    </div>
  );
};

const AppointmentRow = ({ time, patient, owner, type, status, img }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer group">
    <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl text-center">
       <span className="text-sm font-bold text-slate-900 dark:text-white">{time.split(' ')[0]}</span>
       <span className="text-xs text-slate-500 uppercase font-bold">{time.split(' ')[1]}</span>
    </div>
    
    <div className="flex-1">
       <div className="flex items-center gap-2">
         <h4 className="font-bold text-slate-900 dark:text-white text-lg">{patient}</h4>
         <span className="text-sm text-slate-500">({owner})</span>
       </div>
       <p className="text-sm text-slate-500">{type}</p>
    </div>

    <div className="text-right">
       <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
          status === 'Confirmed' 
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
            : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
       }`}>
          {status === 'Confirmed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {status}
       </span>
    </div>
  </div>
);

const Bar = ({ height, day, value, highlight }) => (
  <div className="flex flex-col items-center flex-1 gap-2 group cursor-pointer">
    <div className="relative w-full flex justify-center h-full items-end">
       <div 
          style={{ height: height }} 
          className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ${
             highlight 
             ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' 
             : 'bg-emerald-200 dark:bg-emerald-900/40 group-hover:bg-emerald-400'
          }`}
       >
         {/* Tooltip on hover */}
         <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded transition-opacity">
            {value}
         </div>
       </div>
    </div>
    <span className={`text-xs font-bold ${highlight ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{day}</span>
  </div>
);

export default VetDashboard;