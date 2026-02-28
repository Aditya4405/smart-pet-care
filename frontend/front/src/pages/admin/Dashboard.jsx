import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Activity, AlertTriangle, RefreshCw, Server, Database, Cloud } from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, users: 0, pending: 0, health: 99.9 });
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const refreshDashboardData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [statsRes, apptRes] = await Promise.all([
        fetch('http://localhost:8082/api/admin/dashboard/stats', { headers }),
        fetch('http://localhost:8082/api/admin/appointments', { headers })
      ]);

      if (statsRes.ok && apptRes.ok) {
        const statsData = await statsRes.json();
        const appts = await apptRes.json();

        setStats({
          revenue: statsData.totalRevenue || 0,
          users: (statsData.totalUsers || 0) + (statsData.totalDoctors || 0),
          pending: statsData.pendingApprovals || 0,
          health: 99.9
        });

        const monthly = {};
        appts.forEach(a => {
           if (a.paymentStatus !== 'PAID') return;
           const monthName = new Date(a.appointmentDate).toLocaleString('default', { month: 'short' });
           if (!monthly[monthName]) monthly[monthName] = { name: monthName, revenue: 0 };
           monthly[monthName].revenue += (a.amountPaid || 0);
        });
        setChartData(Object.values(monthly).length > 0 ? Object.values(monthly) : [{name: 'Current', revenue: 0}]);
        setLastRefreshed(new Date());
      }
    } catch (e) { 
      toast.error("Telemetry sync failed."); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    refreshDashboardData();
    const interval = setInterval(() => refreshDashboardData(true), 60000);
    return () => clearInterval(interval);
  }, [dateRange]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 font-mono text-xs">
            LIVE TELEMETRY <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Last synced: {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-3">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-lg px-4 py-2 outline-none focus:border-indigo-500 shadow-sm cursor-pointer">
            <option value="24h">Last 24 Hours</option><option value="7d">Last 7 Days</option><option value="30d">Last 30 Days</option>
          </select>
          <button onClick={() => refreshDashboardData(false)} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition-colors shadow-sm"><RefreshCw size={20} className={isLoading ? "animate-spin" : ""} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Gross Revenue" value={stats.revenue} prefix="₹" trendDirection="up" percentageChange="14.2" icon={DollarSign} color="indigo" isLoading={isLoading} />
        <StatsCard title="Active Users" value={stats.users} trendDirection="up" percentageChange="3.1" icon={Users} color="emerald" isLoading={isLoading} />
        <StatsCard title="Pending Approvals" value={stats.pending} trendDirection="down" percentageChange={stats.pending > 0 ? "10" : "0"} icon={AlertTriangle} color="amber" isLoading={isLoading} />
        <StatsCard title="System Health" value={stats.health} suffix="%" trendDirection="up" percentageChange="0.1" icon={Activity} color="blue" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm dark:shadow-xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Activity size={18} className="text-indigo-500 dark:text-indigo-400"/> Revenue Velocity</h3>
          {isLoading ? <div className="h-[300px] bg-slate-100 dark:bg-slate-800/30 animate-pulse rounded-xl"></div> : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '3 3'}} contentStyle={{ backgroundColor: 'var(--tw-prose-body)', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }} itemStyle={{color: '#6366f1', fontWeight: 'bold'}} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Server size={18} className="text-emerald-500 dark:text-emerald-400"/> Infrastructure Status</h3>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50"><div className="flex items-center gap-3"><Database className="text-slate-400" size={16}/><div><p className="text-sm font-bold text-slate-900 dark:text-white">Database</p><p className="text-xs text-slate-500 font-mono">14ms latency</p></div></div><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div></div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50"><div className="flex items-center gap-3"><Users className="text-slate-400" size={16}/><div><p className="text-sm font-bold text-slate-900 dark:text-white">Auth API</p><p className="text-xs text-slate-500 font-mono">42ms latency</p></div></div><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div></div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20"><div className="flex items-center gap-3"><Cloud className="text-amber-500 dark:text-amber-400" size={16}/><div><p className="text-sm font-bold text-amber-600 dark:text-amber-400">Payment Gateway</p><p className="text-xs text-amber-500/70 font-mono">405ms (Degraded)</p></div></div><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default AdminDashboard;