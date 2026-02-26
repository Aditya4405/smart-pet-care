import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Filter, Calendar, MapPin, Stethoscope, CreditCard, Activity, X, FileText, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import StatsCard from '../../components/admin/StatsCard';
import AnalyticsChart from '../../components/admin/AnalyticsChart';
import toast from 'react-hot-toast';

const AdminAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ dateRange: '30d', doctor: 'ALL', region: 'ALL', service: 'ALL', revenueType: 'ALL', compare: false });
  const [drillDown, setDrillDown] = useState(null);
  
  const [userGrowth, setUserGrowth] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const pieData = [{ name: 'Platform Cut', value: 12450, color: '#10b981' }, { name: 'Vet Earnings', value: 112050, color: '#6366f1' }];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUserGrowth([{ name: 'Mon', users: 120 }, { name: 'Tue', users: 180 }, { name: 'Wed', users: 150 }, { name: 'Thu', users: 220 }, { name: 'Fri', users: 190 }, { name: 'Sat', users: 290 }, { name: 'Sun', users: 310 }]);
      setRiskData([{ name: 'Mon', success: 400, failed: 12 }, { name: 'Tue', success: 420, failed: 8 }, { name: 'Wed', success: 380, failed: 15 }, { name: 'Thu', success: 510, failed: 9 }]);
      setIsLoading(false);
    }, 1000);
  }, [filters]);

  const openMetricDetail = (title, value) => setDrillDown({ title, value, data: Array(5).fill({ id: 'TRX-992', date: '2026-02-26', detail: 'Consultation', amount: '₹500' }) });
  const exportData = () => toast.success("Report successfully exported to CSV.");

  const MetricSection = ({ title, children, gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" }) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">{title}</h3>
      <div className={`grid ${gridCols} gap-4`}>{children}</div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-[1600px] mx-auto pb-12 relative">
      
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Deep Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Advanced platform metrics, retention tracking, and risk monitoring.</p>
        </div>
        <button onClick={exportData} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-sm font-bold text-white rounded-xl transition-all shadow-md flex items-center gap-2">
          <Download size={16} /> Export Global Report
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center gap-3 shadow-sm dark:shadow-lg">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg">
          <Calendar size={14} className="text-slate-500 dark:text-slate-400" />
          <select value={filters.dateRange} onChange={e=>setFilters({...filters, dateRange: e.target.value})} className="bg-transparent text-slate-700 dark:text-white text-xs font-bold outline-none cursor-pointer">
            <option value="7d">Last 7 Days</option><option value="30d">Last 30 Days</option><option value="90d">Last Quarter</option>
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg">
          <Stethoscope size={14} className="text-slate-500 dark:text-slate-400" />
          <select value={filters.doctor} onChange={e=>setFilters({...filters, doctor: e.target.value})} className="bg-transparent text-slate-700 dark:text-white text-xs font-bold outline-none cursor-pointer">
            <option value="ALL">All Doctors</option><option>Dr. Smith</option>
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg">
          <MapPin size={14} className="text-slate-500 dark:text-slate-400" />
          <select value={filters.region} onChange={e=>setFilters({...filters, region: e.target.value})} className="bg-transparent text-slate-700 dark:text-white text-xs font-bold outline-none cursor-pointer">
            <option value="ALL">All Regions</option><option>North</option><option>South</option>
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg">
          <CreditCard size={14} className="text-slate-500 dark:text-slate-400" />
          <select value={filters.revenueType} onChange={e=>setFilters({...filters, revenueType: e.target.value})} className="bg-transparent text-slate-700 dark:text-white text-xs font-bold outline-none cursor-pointer">
            <option value="ALL">All Revenue</option><option>Consultations</option><option>Marketplace</option>
          </select>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Compare vs Last Period</span>
          <button onClick={() => setFilters({...filters, compare: !filters.compare})} className={`w-10 h-5 rounded-full transition-colors relative ${filters.compare ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
            <span className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${filters.compare ? 'translate-x-5' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/50 rounded-3xl p-4 sm:p-6 shadow-sm">
        <MetricSection title="Financial & Revenue">
          <div onClick={()=>openMetricDetail('Gross Revenue', '₹124,500')} className="cursor-pointer h-full"><StatsCard title="Gross Revenue" value={124500} prefix="₹" trendDirection="up" percentageChange="14.2" icon={CreditCard} color="indigo" isLoading={isLoading} /></div>
          <div onClick={()=>openMetricDetail('Platform Earnings', '₹12,450')} className="cursor-pointer h-full"><StatsCard title="Platform Earnings" value={12450} prefix="₹" trendDirection="up" percentageChange="14.2" icon={Activity} color="emerald" isLoading={isLoading} /></div>
          <div onClick={()=>openMetricDetail('Net Revenue', '₹112,050')} className="cursor-pointer h-full"><StatsCard title="Net Revenue" value={112050} prefix="₹" trendDirection="up" percentageChange="12.1" icon={CreditCard} color="blue" isLoading={isLoading} /></div>
          <div onClick={()=>openMetricDetail('Refund Amount', '₹2,400')} className="cursor-pointer h-full"><StatsCard title="Refund Amount" value={2400} prefix="₹" trendDirection="down" percentageChange="1.5" icon={CreditCard} color="red" isLoading={isLoading} /></div>
          <div onClick={()=>openMetricDetail('Avg Transaction', '₹840')} className="cursor-pointer h-full"><StatsCard title="Avg Transaction" value={840} prefix="₹" trendDirection="up" percentageChange="5.4" icon={CreditCard} color="indigo" isLoading={isLoading} /></div>
        </MetricSection>

        <MetricSection title="User & Growth" gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <div onClick={()=>openMetricDetail('New Users', '1,240')} className="cursor-pointer h-full"><StatsCard title="New Users" value={1240} trendDirection="up" percentageChange="8.4" icon={Activity} color="emerald" isLoading={isLoading} /></div>
          <div onClick={()=>openMetricDetail('Active Users', '8,942')} className="cursor-pointer h-full"><StatsCard title="Active Users" value={8942} trendDirection="up" percentageChange="3.1" icon={Activity} color="blue" isLoading={isLoading} /></div>
          <div onClick={()=>openMetricDetail('Churn Rate', '2.1%')} className="cursor-pointer h-full"><StatsCard title="Churn Rate" value={2.1} suffix="%" trendDirection="down" percentageChange="0.4" icon={Activity} color="amber" isLoading={isLoading} /></div>
          <div onClick={()=>openMetricDetail('Vet Approval Rate', '94%')} className="cursor-pointer h-full"><StatsCard title="Vet Approval Rate" value={94} suffix="%" trendDirection="up" percentageChange="2.0" icon={Stethoscope} color="emerald" isLoading={isLoading} /></div>
        </MetricSection>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
          <MetricSection title="Operational Efficiency" gridCols="grid-cols-2">
            <StatsCard title="Cancellation Rate" value={4.2} suffix="%" trendDirection="down" percentageChange="1.1" icon={Activity} color="amber" isLoading={isLoading} />
            <StatsCard title="No-Show Rate" value={2.8} suffix="%" trendDirection="down" percentageChange="0.5" icon={Activity} color="amber" isLoading={isLoading} />
            <StatsCard title="Follow-Up Completion" value={78} suffix="%" trendDirection="up" percentageChange="4.2" icon={CheckCircle2} color="emerald" isLoading={isLoading} />
            <StatsCard title="Avg Booking Time" value={1.2} suffix="m" trendDirection="down" percentageChange="0.2" icon={Activity} color="indigo" isLoading={isLoading} />
          </MetricSection>
          
          <MetricSection title="Platform Risk" gridCols="grid-cols-2">
            <StatsCard title="Failed Payment Rate" value={1.4} suffix="%" trendDirection="down" percentageChange="0.3" icon={Activity} color="red" isLoading={isLoading} />
            <StatsCard title="Fraud Flag Count" value={12} trendDirection="up" percentageChange="2" icon={Activity} color="red" isLoading={isLoading} />
            <StatsCard title="API Error Rate" value={0.01} suffix="%" trendDirection="down" percentageChange="0.01" icon={Activity} color="amber" isLoading={isLoading} />
          </MetricSection>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm dark:shadow-xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">Daily New Users</h3>
          <AnalyticsChart data={userGrowth} dataKey="users" color="#10b981" isLoading={isLoading} />
        </div>

        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Distribution</h3>
          {isLoading ? <div className="flex-1 bg-slate-100 dark:bg-slate-800/30 animate-pulse rounded-xl"></div> : (
            // FIXED: Added flex-1 to the wrapper and min-h for the chart itself so it doesn't push the legend out.
            <div className="flex-1 flex flex-col justify-between min-h-[250px]">
              <div className="flex-1 w-full min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} stroke="transparent" />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} itemStyle={{fontWeight: 'bold'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                {pieData.map(d => <div key={d.name} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300"><span className="w-3 h-3 rounded-full shrink-0" style={{backgroundColor: d.color}}></span> {d.name}</div>)}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm dark:shadow-xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Risk Monitoring (Payments)</h3>
          {isLoading ? <div className="h-64 bg-slate-100 dark:bg-slate-800/30 animate-pulse rounded-xl"></div> : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.3} />
                  <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} dy={10}/>
                  <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false}/>
                  <Tooltip cursor={{fill: '#e2e8f0', opacity: 0.4}} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                  <Bar dataKey="success" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="failed" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Drill Down Modal */}
      <AnimatePresence>
        {drillDown && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrillDown(null)} className="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/80 backdrop-blur-sm z-[200]" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[201] overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <div><h3 className="text-xl font-bold text-slate-900 dark:text-white">{drillDown.title} Detail</h3><p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Total: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{drillDown.value}</span></p></div>
                <div className="flex gap-3">
                  <button onClick={exportData} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-sm font-bold rounded-lg flex items-center gap-2 shadow-sm"><FileText size={16}/> CSV Export</button>
                  <button onClick={() => setDrillDown(null)} className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg"><X size={20}/></button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                    <tr><th className="pb-3">Transaction ID</th><th className="pb-3">Date</th><th className="pb-3">Detail</th><th className="pb-3 text-right">Value</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {drillDown.data.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="py-4 font-mono text-slate-500 dark:text-slate-400">{row.id}</td><td className="py-4 text-slate-600 dark:text-slate-300">{row.date}</td><td className="py-4 text-slate-900 dark:text-white font-bold">{row.detail}</td><td className="py-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminAnalytics;