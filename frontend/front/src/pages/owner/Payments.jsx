import React, { useState } from 'react';
import { 
  CreditCard, Download, Receipt, ArrowUpRight, Search, Filter 
} from 'lucide-react';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Transaction Data
  const transactions = [
    { id: 'INV-2026-001', date: 'Oct 24, 2026', desc: 'Emergency Video Consult - Dr. Wilson', type: 'Consultation', amount: 1500, status: 'Paid' },
    { id: 'INV-2026-002', date: 'Oct 15, 2026', desc: 'Premium Dog Food (10kg)', type: 'Marketplace', amount: 45.99, status: 'Paid' },
    { id: 'INV-2026-003', date: 'Sep 28, 2026', desc: 'In-Clinic Checkup - Dr. Carter', type: 'Consultation', amount: 500, status: 'Paid' },
    { id: 'INV-2026-004', date: 'Sep 10, 2026', desc: 'Flea & Tick Prevention Drops', type: 'Marketplace', amount: 25.50, status: 'Refunded' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Billing & Payments</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your transaction history and invoices.</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-900 dark:bg-slate-800 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
               <p className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-1">Total Spent (YTD)</p>
               <h2 className="text-3xl font-bold">₹2,045.99</h2>
            </div>
            <CreditCard className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
         </div>
         
         <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
               <h3 className="font-bold text-slate-900 dark:text-white">Payment Method</h3>
               <p className="text-sm text-slate-500 mt-1">Visa ending in **** 4242</p>
            </div>
            <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-white transition-colors">
               Update Card
            </button>
         </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
               <Receipt className="w-5 h-5 text-emerald-500" /> Transaction History
            </h3>
            
            <div className="flex items-center gap-2">
               <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
               </div>
               <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500">
                  <Filter className="w-4 h-4" />
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                  <tr>
                     <th className="px-6 py-4">Invoice ID</th>
                     <th className="px-6 py-4">Date</th>
                     <th className="px-6 py-4">Description</th>
                     <th className="px-6 py-4">Amount</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Receipt</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {transactions.map((txn, idx) => (
                     <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-slate-600 dark:text-slate-300">{txn.id}</td>
                        <td className="px-6 py-4 text-slate-500">{txn.date}</td>
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                           {txn.desc}
                           <span className="block text-xs text-slate-400 font-normal mt-0.5">{txn.type}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                           {txn.type === 'Marketplace' ? '$' : '₹'}{txn.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              txn.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                           }`}>
                              {txn.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="Download Invoice">
                              <Download className="w-5 h-5" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Payments;