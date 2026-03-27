import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, CheckCircle2, Clock, ArrowRight, AlertTriangle, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { API } from "../../config/api";

const BASE_API = API.BASE_API;

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]); // Empty array instead of mock data!
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${BASE_API}/admin/support/tickets`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setTickets(await res.json());
    } catch (e) { toast.error("Failed to load tickets."); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, []);

  const resolveTicket = async (id) => {
    try {
      await fetch(`${BASE_API}/admin/support/tickets/${id}/resolve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Ticket closed successfully!');
      fetchTickets(); // Refresh list from DB
    } catch (e) { toast.error("Error resolving ticket"); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-[1200px] mx-auto pb-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <LifeBuoy size={14} /> Helpdesk Engine
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Support Inbox</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Resolve user issues to maintain a 99% satisfaction rate.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? <div className="text-center py-10"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div> : 
         tickets.length === 0 ? <p className="text-slate-500 text-center py-10">No support tickets! Inbox Zero.</p> :
         tickets.map((ticket) => (
          <motion.div layout key={ticket.id} className={`group relative p-5 rounded-2xl border transition-all duration-300 ${
            ticket.status === 'RESOLVED' 
              ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/50 opacity-60 hover:opacity-100' 
              : 'bg-white dark:bg-slate-900/60 backdrop-blur-xl border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-500/50'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                  ticket.status === 'RESOLVED' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-indigo-50 dark:bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                }`}>
                  {ticket.userName ? ticket.userName[0].toUpperCase() : 'U'}
                </div>
                
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-slate-400">#TKT-{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        ticket.status === 'OPEN' ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20' : 
                        ticket.status === 'IN PROGRESS' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : 
                        'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                    }`}>{ticket.status}</span>
                    {ticket.priority === 'Urgent' && ticket.status !== 'RESOLVED' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 border dark:border-red-500/20 px-2 py-0.5 rounded animate-pulse">
                          <AlertTriangle size={10}/> Urgent
                        </span>
                    )}
                  </div>
                  <h3 className={`text-lg font-bold ${ticket.status === 'RESOLVED' ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-700' : 'text-slate-900 dark:text-white'}`}>
                    {ticket.issue}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1.5">
                    <User size={14} /> <span className="font-bold text-slate-700 dark:text-slate-300">{ticket.userName}</span> 
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] uppercase text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{ticket.userRole}</span> 
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-16 md:pl-0 border-t md:border-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                {ticket.status !== 'RESOLVED' ? (
                  <>
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold text-sm transition-colors border border-slate-200 dark:border-slate-700">Reply</button>
                    <button onClick={() => resolveTicket(ticket.id)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center gap-2">
                      <CheckCircle2 size={16} /> Close Ticket
                    </button>
                  </>
                ) : (
                  <button className="text-sm font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors">View Thread <ArrowRight size={14}/></button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
export default AdminSupport;