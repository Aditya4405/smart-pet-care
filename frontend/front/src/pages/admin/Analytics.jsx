import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CreditCard, Activity, Users, Stethoscope, AlertTriangle, Download, RefreshCw } from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import toast from 'react-hot-toast';

import { API } from "../../config/api";

const BASE_URL = API.BASE_URL;



const AdminAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('allTime');
  
  // Metrics State
  const [metrics, setMetrics] = useState({
    grossRevenue: 0,
    platformEarnings: 0,
    vetEarnings: 0,
    totalTransactions: 0,
    totalOwners: 0,
    totalVets: 0
  });

  const [growthData, setGrowthData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

  const getDateRangeBounds = (range) => {
    const end = new Date();
    let start = new Date();
    switch(range) {
      case '7d': start.setDate(end.getDate() - 6); break;
      case '30d': start.setDate(end.getDate() - 29); break;
      case 'thisMonth': start = new Date(end.getFullYear(), end.getMonth(), 1); break;
      case 'lastMonth': start = new Date(end.getFullYear(), end.getMonth() - 1, 1); end.setDate(0); break;
      case 'thisYear': start = new Date(end.getFullYear(), 0, 1); break;
      case 'allTime': start = new Date(2000, 0, 1); break;
      default: start.setDate(end.getDate() - 7);
    }
    return { start, end };
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch Everything
      const [apptRes, orderRes, userRes, vetRes] = await Promise.all([
        fetch(`${BASE_URL}/api/admin/appointments`, { headers }).catch(() => ({ ok: false, json: () => [] })),
        fetch(`${BASE_URL}/api/orders/admin/all`, { headers }).catch(() => ({ ok: false, json: () => [] })),
        fetch(`${BASE_URL}/api/admin/users`, { headers }).catch(() => ({ ok: false, json: () => [] })),
        fetch(`${BASE_URL}/api/admin/vets`, { headers }).catch(() => ({ ok: false, json: () => [] }))
      ]);

      const allAppts = apptRes.ok ? await apptRes.json() : [];
      const allOrders = orderRes.ok ? await orderRes.json() : [];
      const allUsers = userRes.ok ? await userRes.json() : [];
      const allVets = vetRes.ok ? await vetRes.json() : [];

      const { start, end } = getDateRangeBounds(dateRange);

      // Filter Data by Date
      const validAppts = allAppts.filter(a => a.paymentStatus === 'PAID' && new Date(a.appointmentDate) >= start && new Date(a.appointmentDate) <= end);
      const validOrders = allOrders.filter(o => o.status !== 'CANCELLED' && new Date(o.orderDate) >= start && new Date(o.orderDate) <= end);

      // Financial Calculations
      let vetRevenue = 0;
      validAppts.forEach(a => vetRevenue += (a.amountPaid || 0));

      let shopRevenue = 0;
      validOrders.forEach(o => shopRevenue += (o.totalAmount || 0));

      const gross = vetRevenue + shopRevenue;
      // Platform gets 100% of Shop Sales + 10% of Vet Appointments
      const platformCut = shopRevenue + (vetRevenue * 0.10); 
      const netVetEarnings = vetRevenue * 0.90;

      setMetrics({
        grossRevenue: gross,
        platformEarnings: platformCut,
        vetEarnings: netVetEarnings,
        totalTransactions: validAppts.length + validOrders.length,
        totalOwners: allUsers.length,
        totalVets: allVets.length
      });

      setPieData([
        { name: 'Platform Cut', value: platformCut },
        { name: 'Vet Earnings', value: netVetEarnings }
      ]);

      // Growth Trajectory (Transactions over time)
      const isDayView = ['7d', '30d', 'thisMonth', 'lastMonth'].includes(dateRange);
      const groupedData = {};

      // Pre-fill Timeline
      if (isDayView) {
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          groupedData[key] = { name: key, transactions: 0, sortDate: new Date(d) };
        }
      } else {
        let monthStart = dateRange === 'allTime' && (validAppts.length > 0 || validOrders.length > 0)
          ? new Date(Math.min(...[...validAppts.map(a => new Date(a.appointmentDate)), ...validOrders.map(o => new Date(o.orderDate))]))
          : new Date(start);
          
        for (let m = new Date(monthStart); m <= end; m.setMonth(m.getMonth() + 1)) {
          const key = m.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          groupedData[key] = { name: key, transactions: 0, sortDate: new Date(m.getFullYear(), m.getMonth(), 1) };
        }
      }

      // Populate Timeline
      [...validAppts.map(a => new Date(a.appointmentDate)), ...validOrders.map(o => new Date(o.orderDate))].forEach(date => {
         const key = isDayView 
            ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
         if (groupedData[key]) groupedData[key].transactions += 1;
      });

      setGrowthData(Object.values(groupedData).sort((a, b) => a.sortDate - b.sortDate));

    } catch (e) {
      toast.error("Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const COLORS = ['#10b981', '#6366f1']; // Emerald (Platform), Indigo (Vets)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-[1600px] mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Deep Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Advanced platform metrics, revenue splits, and activity tracking.</p>
        </div>
        
        <div className="flex items-center gap-3">
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
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-bold shadow-lg transition-colors">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Financials Row */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Financial & Revenue</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Gross Revenue" value={metrics.grossRevenue} prefix="₹" icon={CreditCard} color="indigo" isLoading={isLoading} />
          <StatsCard title="Platform Earnings" value={metrics.platformEarnings} prefix="₹" icon={Activity} color="emerald" isLoading={isLoading} />
          <StatsCard title="Vet Earnings" value={metrics.vetEarnings} prefix="₹" icon={CreditCard} color="blue" isLoading={isLoading} />
          <StatsCard title="Total Transactions" value={metrics.totalTransactions} icon={CreditCard} color="amber" isLoading={isLoading} />
        </div>
      </div>

      {/* Users Row */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">User & Growth</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Pet Owners" value={metrics.totalOwners} icon={Users} color="emerald" isLoading={isLoading} />
          <StatsCard title="Approved Vets" value={metrics.totalVets} icon={Stethoscope} color="blue" isLoading={isLoading} />
          <StatsCard title="Churn Rate" value={1.2} suffix="%" icon={Activity} color="amber" isLoading={isLoading} />
          <StatsCard title="Platform Health" value={99.9} suffix="%" icon={Activity} color="emerald" isLoading={isLoading} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart: Transactions Trajectory */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm dark:shadow-xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Activity Trajectory (Transactions)</h3>
          {isLoading ? <div className="h-[300px] bg-slate-100 dark:bg-slate-800/30 animate-pulse rounded-xl"></div> : (
            <div style={{ width: '100%', height: '300px', minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} minTickGap={20} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{stroke: '#10b981', strokeWidth: 1, strokeDasharray: '3 3'}} 
                    contentStyle={{ backgroundColor: 'var(--tw-prose-body)', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }} 
                    itemStyle={{color: '#10b981', fontWeight: 'bold'}}
                  />
                  <Area type="monotone" dataKey="transactions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAct)" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pie Chart: Revenue Distribution */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Revenue Distribution</h3>
          {isLoading ? <div className="flex-1 bg-slate-100 dark:bg-slate-800/30 animate-pulse rounded-xl mt-4"></div> : (
            <div className="flex-1 flex flex-col items-center justify-center">
              {metrics.grossRevenue === 0 ? (
                <p className="text-slate-500 text-sm">No revenue data available for this period.</p>
              ) : (
                <div style={{ width: '100%', height: '240px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(value) => formatINR(value)} contentStyle={{ borderRadius: '10px' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};
export default AdminAnalytics;