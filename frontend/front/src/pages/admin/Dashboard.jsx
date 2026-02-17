import React from 'react';
import { 
  Users, DollarSign, Activity, TrendingUp, ArrowUpRight, 
  ArrowDownRight, Calendar, AlertCircle 
} from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Executive Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Real-time platform performance metrics.</p>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Revenue" 
          value="$124,500" 
          change="+12.5%" 
          trend="up" 
          icon={DollarSign} 
          color="emerald" 
        />
        <KPICard 
          title="Active Users" 
          value="8,249" 
          change="+3.2%" 
          trend="up" 
          icon={Users} 
          color="blue" 
        />
        <KPICard 
          title="Pending Doctors" 
          value="14" 
          change="Requires Action" 
          trend="neutral" 
          icon={AlertCircle} 
          color="amber" 
        />
        <KPICard 
          title="Appointments Today" 
          value="142" 
          change="-4.1%" 
          trend="down" 
          icon={Calendar} 
          color="purple" 
        />
      </div>

      {/* 3. Charts Section (CSS-Only Mock Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Revenue Growth</h3>
              <p className="text-sm text-slate-500">Monthly Recurring Revenue (MRR)</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-700 border-none text-sm rounded-lg p-2 font-bold outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          
          {/* Visual Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2">
            {[35, 45, 30, 60, 75, 50, 65, 80, 70, 85, 90, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end group">
                <div 
                  style={{ height: `${h}%` }} 
                  className="bg-indigo-500/20 group-hover:bg-indigo-500 dark:bg-indigo-500/40 dark:group-hover:bg-indigo-400 rounded-t-sm transition-all duration-300 relative"
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded font-bold transition-opacity">
                    ${h}k
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 uppercase">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        {/* User Stats Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">User Demographics</h3>
          <div className="space-y-6">
            <StatRow label="Pet Owners" value="85%" color="bg-blue-500" count="7,012" />
            <StatRow label="Veterinarians" value="12%" color="bg-emerald-500" count="984" />
            <StatRow label="Admins" value="3%" color="bg-purple-500" count="253" />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
             <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Recent Activity</h4>
             <div className="space-y-4">
               <ActivityItem text="New doctor registration: Dr. Smith" time="2m ago" />
               <ActivityItem text="Marketplace order #4920 shipped" time="15m ago" />
               <ActivityItem text="User report filed against ID #992" time="1h ago" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components for Clean Code ---

const KPICard = ({ title, value, change, trend, icon: Icon, color }) => {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={22} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
          {trend === 'up' && <ArrowUpRight size={12} />}
          {trend === 'down' && <ArrowDownRight size={12} />}
          {change}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        <p className="text-sm font-medium text-slate-500">{title}</p>
      </div>
    </div>
  );
};

const StatRow = ({ label, value, color, count }) => (
  <div>
    <div className="flex justify-between text-sm font-bold mb-2">
      <span className="text-slate-700 dark:text-slate-300">{label}</span>
      <span className="text-slate-900 dark:text-white">{count}</span>
    </div>
    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <div style={{ width: value }} className={`h-full ${color} rounded-full`} />
    </div>
  </div>
);

const ActivityItem = ({ text, time }) => (
  <div className="flex items-start gap-3">
    <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 shrink-0" />
    <div>
      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-tight">{text}</p>
      <p className="text-xs text-slate-500 mt-1">{time}</p>
    </div>
  </div>
);

export default AdminDashboard;