import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Activity, AlertTriangle, RefreshCw, Server, Database, Cloud } from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import toast from 'react-hot-toast';
import { API } from "../../config/api";

const BASE_URL = API.BASE_API;

const AdminDashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, users: 0, pending: 0, health: 99.9 });
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('allTime');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const getDateRangeBounds = (range) => {
    const end = new Date();
    let start = new Date();
    switch(range) {
      case '7d': start.setDate(end.getDate() - 6); break; 
      case '30d': start.setDate(end.getDate() - 29); break;
      case 'thisMonth': start = new Date(end.getFullYear(), end.getMonth(), 1); break;
      case 'lastMonth': 
        start = new Date(end.getFullYear(), end.getMonth() - 1, 1); 
        end.setDate(0); 
        break;
      case 'thisYear': start = new Date(end.getFullYear(), 0, 1); break;
      case 'allTime': start = new Date(2000, 0, 1); break; 
      default: start.setDate(end.getDate() - 7);
    }
    return { start, end };
  };

  const refreshDashboardData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [statsRes, apptRes, orderRes] = await Promise.all([
        fetch(`${BASE_URL}/admin/dashboard/stats`, { headers }),
        fetch(`${BASE_URL}/admin/appointments`, { headers }),
        fetch(`${BASE_URL}/orders/admin/all`, { headers }).catch(() => ({ ok: false }))
      ]);

      let allRevenueEvents = [];

      if (apptRes.ok) {
        const appts = await apptRes.json();
        appts.forEach(a => {
           if (a.paymentStatus === 'PAID') {
             allRevenueEvents.push({ date: new Date(a.appointmentDate), amount: a.amountPaid || 0 });
           }
        });
      }

      if (orderRes && orderRes.ok) {
        const orders = await orderRes.json();
        orders.forEach(o => {
          if (o.status !== 'CANCELLED') {
            allRevenueEvents.push({ date: new Date(o.orderDate), amount: o.totalAmount || 0 });
          }
        });
      }

      // ✅ FIX: Filter events FIRST, then sum them up!
      const { start, end } = getDateRangeBounds(dateRange);
      const filteredEvents = allRevenueEvents.filter(e => e.date >= start && e.date <= end);
      const filteredTotalRevenue = filteredEvents.reduce((sum, event) => sum + event.amount, 0);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats({
          revenue: filteredTotalRevenue, 
          users: (statsData.totalUsers || 0) + (statsData.totalDoctors || 0),
          pending: statsData.pendingApprovals || 0,
          health: 99.9
        });
      }

      const isDayView = ['7d', '30d', 'thisMonth', 'lastMonth'].includes(dateRange);
      const groupedData = {};

      if (isDayView) {
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          groupedData[key] = { name: key, revenue: 0, sortDate: new Date(d) };
        }
      } else {
        let monthStart = new Date(start);
        if (dateRange === 'allTime') {
           const earliestYear = allRevenueEvents.length > 0 
              ? Math.min(...allRevenueEvents.map(e => e.date.getFullYear()))
              : end.getFullYear();
           monthStart = new Date(earliestYear, 0, 1);
        }
        for (let m = new Date(monthStart); m <= end; m.setMonth(m.getMonth() + 1)) {
          const key = m.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          groupedData[key] = { name: key, revenue: 0, sortDate: new Date(m.getFullYear(), m.getMonth(), 1) };
        }
      }

      filteredEvents.forEach(e => {
         const key = isDayView 
            ? e.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : e.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
         if (groupedData[key]) groupedData[key].revenue += e.amount;
      });

      const finalChartData = Object.values(groupedData).sort((a, b) => a.sortDate - b.sortDate);

      setChartData(finalChartData.length > 0 ? finalChartData : [{ name: 'No Data', revenue: 0 }]);
      setLastRefreshed(new Date());
      
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
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)} 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-lg px-4 py-2 outline-none focus:border-indigo-500 shadow-sm cursor-pointer font-medium"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
            <option value="allTime">All Time</option>
          </select>
          <button onClick={() => refreshDashboardData(false)} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition-colors shadow-sm">
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Activity size={18} className="text-indigo-500 dark:text-indigo-400"/> Revenue Velocity</h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
              {['7d', '30d', 'thisMonth', 'lastMonth'].includes(dateRange) ? 'Daily view' : 'Monthly view'}
            </span>
          </div>

          {isLoading ? <div className="h-[300px] bg-slate-100 dark:bg-slate-800/30 animate-pulse rounded-xl"></div> : (
            <div style={{ width: '100%', height: '300px', minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} minTickGap={20} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    cursor={{stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '3 3'}} 
                    contentStyle={{ backgroundColor: 'var(--tw-prose-body)', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }} 
                    itemStyle={{color: '#6366f1', fontWeight: 'bold'}}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
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