import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Shield, Server, User, Info, AlertTriangle, RefreshCcw } from 'lucide-react'; // <-- ADDED RefreshCcw
import toast from 'react-hot-toast';
import { API } from "../../config/api";


const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- MOVED FETCH LOGIC OUTSIDE USEEFFECT SO WE CAN REUSE IT ---
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API.BASE_API}/admin/audit-logs`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }});
      if (res.ok) {
        const data = await res.json();
        // Sort newest logs to the top
        setLogs(data.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
      }
    } catch (e) { 
        toast.error("Failed to sync audit logs."); 
    } finally { 
        setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const exportLogs = () => toast.success("Downloading logs.csv...");

  const getIconForSeverity = (sev) => {
      if(sev === 'CRITICAL') return Shield;
      if(sev === 'WARNING') return AlertTriangle;
      return Info;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-[1200px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Audit Logs</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Immutable security and event timeline.</p>
        </div>
        
        <div className="flex items-center gap-3">
            {/* --- NEW REFRESH BUTTON --- */}
            <button 
                onClick={fetchLogs} 
                className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 text-indigo-700 dark:text-indigo-400 rounded-lg flex items-center gap-2 shadow-sm font-medium transition-colors"
            >
                <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} /> 
                Refresh Logs
            </button>
            
            <button 
                onClick={exportLogs} 
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-white rounded-lg flex items-center gap-2 shadow-sm transition-colors font-medium"
            >
                <Download size={16}/> 
                Export CSV
            </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden p-6 min-h-[400px]">
        {isLoading ? <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div> : 
         logs.length === 0 ? <p className="text-center text-slate-500 py-20">No system events recorded yet.</p> :
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800/80 z-10">
          {logs.map((log) => {
            const Icon = getIconForSeverity(log.severity);
            return (
              <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 bg-white dark:bg-slate-950 ${log.severity==='CRITICAL' ? 'border-red-200 text-red-600 dark:border-red-500/30 dark:text-red-500' : log.severity==='WARNING' ? 'border-amber-200 text-amber-600 dark:border-amber-500/30 dark:text-amber-500' : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'}`}>
                  <Icon size={18} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm dark:shadow-lg group-hover:border-indigo-300 dark:group-hover:border-slate-600 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{log.action}</span>
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span>ACTOR: <span className="font-bold text-slate-700 dark:text-slate-300">{log.actor}</span></span><span>IP: {log.ipAddress}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>}
      </div>
    </motion.div>
  );
};
export default AdminAuditLogs;