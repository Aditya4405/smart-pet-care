import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, DollarSign, Activity, PieChart as PieChartIcon, Search, CheckCircle, RefreshCcw, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';
import { API } from "../../config/api";

const BASE_API = API.BASE_API;

const AdminFinancials = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('allTime');
  const [searchTerm, setSearchTerm] = useState('');

  const [metrics, setMetrics] = useState({
    gross: 0,
    platformCut: 0,
    pendingVetPayouts: 0
  });

  const [ledger, setLedger] = useState([]);
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

  const fetchFinancials = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // --- FETCH FROM NEW CENTRALIZED PAYMENT LEDGER ---
      const res = await fetch(`${BASE_API}/payments/all`, { headers });
      if (!res.ok) throw new Error("Failed to fetch payments");
      
      const allPayments = await res.json();
      const { start, end } = getDateRangeBounds(dateRange);

      let totalGross = 0;
      let totalPlatformCut = 0;
      let totalVetPayouts = 0;
      let consultTotal = 0;
      let marketTotal = 0;

      const entries = [];

      allPayments.forEach(p => {
        const pDate = new Date(p.createdAt);
        
        // Filter by Date Range
        if (pDate >= start && pDate <= end) {
            const amt = p.amount || 0;
            let net = 0;
            let netPercent = '';
            let details = '';
            
            // Only add to revenue if the payment was SUCCESSFUL
            const isSuccess = p.status === 'SUCCESS';

            if (p.paymentType === 'APPOINTMENT') {
                const platformShare = amt * 0.10;
                const vetShare = amt * 0.90;
                
                if (isSuccess) {
                    totalGross += amt;
                    totalPlatformCut += platformShare;
                    totalVetPayouts += vetShare;
                    consultTotal += amt;
                }
                
                net = platformShare;
                netPercent = '10%';
                details = 'Consultation';
            } else {
                // Marketplace Order
                if (isSuccess) {
                    totalGross += amt;
                    totalPlatformCut += amt; 
                    marketTotal += amt;
                }
                net = amt;
                netPercent = '100%';
                details = 'Marketplace Order';
            }

            entries.push({
                internalDbId: p.id, // <-- ADDED FOR REFUND FUNCTION
                id: p.razorpayPaymentId || `TXN-${p.id}`,
                date: pDate,
                details: details,
                subtext: p.userEmail || 'Guest Checkout',
                gross: amt,
                net: net,
                netPercent: netPercent,
                status: p.status
            });
        }
      });

      // Sort Ledger newest first
      entries.sort((a, b) => b.date - a.date);

      setMetrics({
        gross: totalGross,
        platformCut: totalPlatformCut,
        pendingVetPayouts: totalVetPayouts
      });

      setLedger(entries);

      setPieData([
        { name: 'Consultations', value: consultTotal },
        { name: 'Marketplace', value: marketTotal }
      ]);

    } catch (e) {
      toast.error("Failed to load financial data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancials();
  }, [dateRange]);


  // --- REFUND HANDLER ---
  const handleRefund = async (txnId) => {
    if (!window.confirm("Are you sure you want to refund this transaction? The money will be returned to the customer's bank account.")) return;

    const toastId = toast.loading("Processing refund via Razorpay...");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_API}/payments/refund/${txnId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        toast.success("Refund successful!", { id: toastId });
        fetchFinancials(); // Refresh the table and charts
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Refund failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Network error during refund.", { id: toastId });
    }
  };


  // --- SEARCH FILTER ---
  const filteredLedger = ledger.filter(entry => 
    entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.subtext.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLORS = ['#6366f1', '#10b981']; // Indigo, Emerald

  const renderStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS': return <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> SUCCESS</span>;
      case 'REFUNDED': return <span className="px-2 py-1 rounded text-[10px] font-bold bg-amber-100 text-amber-700 flex items-center gap-1 w-fit"><RefreshCcw className="w-3 h-3"/> REFUNDED</span>;
      case 'FAILED': return <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-700 flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> FAILED</span>;
      default: return <span className="px-2 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-700 w-fit">{status}</span>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-[1600px] mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Revenue Engine</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Platform cash flow, commission logic, and payouts.</p>
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
            <Download size={16} /> Export Financials
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Crunching the numbers...</p>
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Revenue Card */}
            <div className="relative bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-3xl p-8 overflow-hidden shadow-xl lg:col-span-1 flex flex-col justify-center min-h-[160px]">
              <div className="relative z-10">
                <p className="text-indigo-200 text-xs font-bold tracking-widest uppercase mb-2">Gross Processing Volume</p>
                <h2 className="text-4xl md:text-5xl font-black text-white">{formatINR(metrics.gross)}</h2>
              </div>
              <DollarSign className="absolute -right-6 -bottom-6 w-48 h-48 text-white opacity-5" />
            </div>

            {/* Platform Cut Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">Platform Cut</p>
                <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded">10% Config</span>
              </div>
              <h2 className="text-3xl font-black text-emerald-500 mb-4">{formatINR(metrics.platformCut)}</h2>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: metrics.gross > 0 ? `${(metrics.platformCut / metrics.gross) * 100}%` : '0%' }}></div>
              </div>
            </div>

            {/* Payouts Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
              <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-2">Pending Vet Payouts</p>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">{formatINR(metrics.pendingVetPayouts)}</h2>
              <button 
                onClick={() => toast.success("Payout batch queued for processing!")}
                disabled={metrics.pendingVetPayouts === 0}
                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-transform rounded-xl font-bold text-sm"
              >
                Process Batch
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Ledger Table */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="text-indigo-500" size={18} />
                    <h3 className="font-bold text-slate-900 dark:text-white">Ledger Entries</h3>
                </div>
                
                {/* SEARCH BAR */}
                <div className="relative w-48 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search TXN ID or Email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                    />
                </div>
              </div>
              
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-500 tracking-wider sticky top-0 backdrop-blur-md">
                    <tr>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800">TXN_ID & Date</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800">Details</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800">Gross</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800">Status</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800 text-right">Net Fee</th>
                      {/* NEW ACTION COLUMN */}
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                    {filteredLedger.length === 0 ? (
                      <tr><td colSpan="6" className="p-8 text-center text-slate-500 italic">No transactions found.</td></tr>
                    ) : (
                      filteredLedger.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="p-4">
                              <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">{entry.id}</p>
                              <p className="text-[10px] text-slate-500 mt-1">{entry.date.toLocaleString()}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">{entry.details}</p>
                            <p className="text-xs text-slate-500">{entry.subtext}</p>
                          </td>
                          <td className="p-4 font-bold text-slate-900 dark:text-white">{formatINR(entry.gross)}</td>
                          <td className="p-4">{renderStatusBadge(entry.status)}</td>
                          <td className="p-4 text-right">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatINR(entry.net)}</span>
                            <span className="ml-2 text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono">({entry.netPercent})</span>
                          </td>
                          {/* NEW REFUND BUTTON */}
                          <td className="p-4 text-right">
                            {entry.status === 'SUCCESS' ? (
                              <button 
                                onClick={() => handleRefund(entry.internalDbId)} 
                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-500/10 dark:text-red-400 font-bold text-xs rounded-lg transition-colors border border-red-200 dark:border-red-500/20"
                              >
                                Refund
                              </button>
                            ) : (
                              <span className="text-slate-400 text-xs italic">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[500px]">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <PieChartIcon className="text-indigo-500" size={18} />
                <h3 className="font-bold text-slate-900 dark:text-white">Service Distribution</h3>
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                {metrics.gross === 0 ? (
                  <p className="text-slate-500 text-sm">No data available.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(value) => formatINR(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </motion.div>
  );
};

export default AdminFinancials;