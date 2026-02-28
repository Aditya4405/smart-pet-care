import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Download, Receipt, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import StatsCard from '../../components/admin/StatsCard';

const AdminFinancials = () => {
  const [transactions, setTransactions] = useState([]);
  const [commission, setCommission] = useState(10); 
  const [stats, setStats] = useState({ gross: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('This Month');

  useEffect(() => {
    const fetchFin = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8082/api/admin/appointments', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          const paid = data.filter(a => ['PAID', 'COMPLETED', 'SCHEDULED'].includes(a.status));
          setTransactions(paid.sort((a,b) => b.id - a.id));
          setStats({ gross: paid.reduce((sum, a) => sum + (a.amountPaid || 0), 0) });
        }
      } catch(e) { console.error(e); } finally { setIsLoading(false); }
    };
    fetchFin();
  }, []);

  const platformCut = stats.gross * (commission / 100);
  const vetPayout = stats.gross - platformCut;
  const pieData = [{ name: 'General', value: 60, color: '#6366f1' }, { name: 'Vaccination', value: 25, color: '#10b981' }, { name: 'Surgery', value: 15, color: '#f59e0b' }];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-[1600px] mx-auto pb-12">
      
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Revenue Engine</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Platform cash flow, commission logic, and payouts.</p>
        </div>
        <div className="flex gap-2">
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-lg px-4 py-2 outline-none shadow-sm"><option>This Month</option><option>Last Month</option></select>
          <button className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-700 dark:text-white rounded-xl transition-all shadow-sm flex items-center gap-2">
            <Download size={16} /> Export Financials
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-900 dark:from-indigo-900 dark:to-slate-900 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden shadow-lg dark:shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-2">Gross Processing Volume</p>
          <h2 className="text-5xl font-black text-white tracking-tighter">₹{stats.gross.toLocaleString()}</h2>
          <DollarSign className="absolute -right-10 -bottom-10 w-48 h-48 text-white/10 dark:text-indigo-500/20" />
        </div>
        
        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-sm dark:shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Platform Cut</p>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded text-xs">{commission}% Config</span>
          </div>
          <h2 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">₹{platformCut.toLocaleString()}</h2>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
             <input type="range" min="1" max="30" value={commission} onChange={(e) => setCommission(e.target.value)} className="w-full accent-emerald-500 cursor-pointer" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-sm dark:shadow-lg">
          <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-4">Pending Vet Payouts</p>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">₹{vetPayout.toLocaleString()}</h2>
          <button className="w-full mt-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-2 rounded-xl transition-colors">Process Batch</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-xl">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/50 flex items-center gap-2">
            <Receipt size={18} className="text-indigo-500 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white tracking-wide">Ledger Entries</h3>
          </div>
          <div className="overflow-x-auto h-[350px] custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 border-b border-slate-200 dark:border-slate-800">
                <tr><th className="px-6 py-3">TXN_ID</th><th className="px-6 py-3">Details</th><th className="px-6 py-3">Gross</th><th className="px-6 py-3 text-emerald-600 dark:text-emerald-400">Net Fee ({commission}%)</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {isLoading ? <tr><td colSpan="4" className="p-6 text-center text-slate-500 animate-pulse">Scanning ledger...</td></tr> : 
                 transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">TX-APT-{txn.id}</td>
                    <td className="px-6 py-4"><p className="font-bold text-slate-800 dark:text-slate-200">Consultation</p><p className="text-xs text-slate-500">Dr. {txn.vet?.lastName}</p></td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">₹{txn.amountPaid}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">+₹{(txn.amountPaid * (commission/100)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-col">
           <h3 className="font-bold text-slate-900 dark:text-white tracking-wide mb-6 flex items-center gap-2"><PieChartIcon size={18} className="text-indigo-500 dark:text-indigo-400"/> Service Distribution</h3>
           <div className="flex-1 min-h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                   {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />)}
                 </Pie>
                 <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="flex justify-center gap-4 mt-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div><span className="text-xs text-slate-600 dark:text-slate-400">{d.name}</span></div>
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
};
export default AdminFinancials;