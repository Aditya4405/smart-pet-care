import React from 'react';
import { 
  Calendar, Users, Clock, DollarSign, ArrowUpRight, 
  CheckCircle, MoreHorizontal 
} from 'lucide-react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { firstName: 'Aditya', lastName: 'Prajapati' };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-500">
      
      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dr. {user.lastName}'s Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium tracking-wide">
            Overview of your practice today.
          </p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all">
          View Schedule
        </button>
      </div>

      {/* 2. KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Appointments Today" value="8" trend="+12%" icon={Calendar} color="blue" />
        <StatCard title="Total Patients" value="1,240" trend="+4%" icon={Users} color="indigo" />
        <StatCard title="Pending Requests" value="3" trend="0%" icon={Clock} color="amber" />
        <StatCard title="Earnings (Today)" value="$450" trend="+8%" icon={DollarSign} color="emerald" />
      </div>

      {/* 3. Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Today's Appointments (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-slate-900 dark:text-white text-lg">Today's Schedule</h3>
            </div>
            <div className="space-y-4">
              <AppointmentRow time="10:00 AM" patient="Bella" owner="Aditya" type="Checkup" status="Confirmed" />
              <AppointmentRow time="11:30 AM" patient="Rocky" owner="Rahul" type="Vaccination" status="Pending" />
              <AppointmentRow time="02:00 PM" patient="Max" owner="Priya" type="Surgery" status="Confirmed" />
            </div>
          </div>
        </div>

        {/* RIGHT: Weekly Earnings Graph (1/3 width) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-full min-h-[300px] flex flex-col">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6">Weekly Earnings</h3>
            
            {/* Chart Container */}
            <div className="flex items-end justify-between flex-1 gap-2 mt-4 h-48">
               <Bar height="40%" day="Mon" value="$400" />
               <Bar height="30%" day="Tue" value="$300" />
               <Bar height="55%" day="Wed" value="$550" />
               <Bar height="45%" day="Thu" value="$450" />
               <Bar height="60%" day="Fri" value="$600" />
               <Bar height="85%" day="Sat" value="$850" highlight />
               <Bar height="20%" day="Sun" value="$200" />
            </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const StatCard = ({ title, value, trend, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  };
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}><Icon className="w-5 h-5" /></div>
      </div>
    </div>
  );
};

const AppointmentRow = ({ time, patient, owner, type, status }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-slate-100 dark:border-slate-700/50">
    <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-xl text-center">
       <span className="text-xs font-bold text-slate-900 dark:text-white">{time.split(' ')[0]}</span>
       <span className="text-[10px] text-slate-500 uppercase font-bold">{time.split(' ')[1]}</span>
    </div>
    <div className="flex-1">
       <h4 className="font-bold text-slate-900 dark:text-white">{patient} <span className="text-slate-500 font-normal text-sm">({owner})</span></h4>
       <p className="text-xs text-slate-500 font-bold uppercase">{type}</p>
    </div>
    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{status}</span>
  </div>
);

// FIX: Improved Bar Visibility for Dark Mode
const Bar = ({ height, day, highlight }) => (
  <div className="flex flex-col items-center flex-1 gap-2 group cursor-pointer h-full justify-end">
    <div className="w-full flex justify-center items-end h-full">
       <div 
         style={{ height }} 
         className={`w-full max-w-[30px] rounded-t-md transition-all ${
           highlight 
             ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' 
             : 'bg-emerald-200 dark:bg-emerald-800 group-hover:bg-emerald-400 dark:group-hover:bg-emerald-700'
         }`} 
       />
    </div>
    <span className="text-[10px] font-bold text-slate-400">{day}</span>
  </div>
);

export default Dashboard;