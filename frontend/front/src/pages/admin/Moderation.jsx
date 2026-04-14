import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, CheckCircle, Ban, Search } from 'lucide-react';
import ConfirmModal from '../../components/shared/ConfirmModal';
import toast from 'react-hot-toast';
import { API } from "../../config/api";

const BASE_API = API.BASE_API;

const AdminModeration = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });

  const fetchReports = async () => {
    try {
      const res = await fetch(`${BASE_API}/admin/moderation/reports`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setReports(await res.json());
    } catch (e) { toast.error("Failed to load reports"); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchReports(); }, []);

  // --- UPDATED: THE BANNING LOGIC ---
  const executeBulkAction = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (confirmModal.action === 'BAN_USER') {
        // Step 1: Fetch active vets so we can match the reported name to their actual database ID
        const vetsRes = await fetch(`${BASE_API}/users/approved-vets`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const activeVets = await vetsRes.json();

        // Step 2: Loop through selected reports and ban the actual user
        for (const id of selectedIds) {
            const report = reports.find(r => r.id === id);
            
            if (report) {
                // Find the doctor whose name matches the report's target (e.g., "Dr. Ankit Prajapati")
                const matchedVet = activeVets.find(v => `Dr. ${v.firstName} ${v.lastName}` === report.target);
                
                if (matchedVet) {
                    // Send the Ban Request to the User Controller!
                    await fetch(`${BASE_API}/users/${matchedVet.id}/status?status=SUSPENDED`, {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }

                // Delete the report from the moderation queue after processing
                await fetch(`${BASE_API}/admin/moderation/reports/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
        }
      } else {
        // Just Dismiss the reports (Delete them without banning)
        await Promise.all(selectedIds.map(id => 
          fetch(`${BASE_API}/admin/moderation/reports/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          })
        ));
      }

      toast.success(confirmModal.action === 'BAN_USER' ? `Successfully suspended violators and cleared reports.` : `Reports dismissed.`);
      setSelectedIds([]);
      fetchReports(); // Refresh data
      
    } catch (e) { 
      console.error(e);
      toast.error("Failed to process action"); 
    }
    setConfirmModal({isOpen: false, action: null});
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-[1200px] mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Trust & Safety</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Review flagged content and maintain community guidelines.</p>
      </div>

      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/50 flex justify-between items-center bg-slate-50 dark:bg-slate-900/80">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
            <input type="text" placeholder="Search reports..." className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-indigo-500 outline-none" />
          </div>
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex gap-2">
                <button onClick={() => setConfirmModal({isOpen: true, action: 'DISMISS'})} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"><CheckCircle size={14}/> Dismiss</button>
                <button onClick={() => setConfirmModal({isOpen: true, action: 'BAN_USER'})} className="px-3 py-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/20 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"><Ban size={14}/> Ban Violators</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-950/50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800/80">
            <tr>
              <th className="px-6 py-4 w-10"><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? reports.map(r=>r.id) : [])} checked={selectedIds.length === reports.length && reports.length > 0} className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 accent-indigo-500" /></th>
              <th className="px-6 py-4">Report Details</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {isLoading ? <tr><td colSpan="4" className="p-10 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr> :
            reports.map(r => (
              <tr key={r.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${selectedIds.includes(r.id) ? 'bg-indigo-50 dark:bg-indigo-500/5' : ''}`}>
                <td className="px-6 py-4"><input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => setSelectedIds(p => p.includes(r.id) ? p.filter(i=>i!==r.id) : [...p, r.id])} className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 accent-indigo-500"/></td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 dark:text-white">{r.reason}</p>
                  <p className="text-xs text-slate-500">Target: {r.target} • #{r.id}</p>
                </td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${r.severity === 'HIGH' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'}`}><AlertTriangle size={10} className="inline mr-1 mb-0.5"/>{r.severity}</span></td>
                <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400 text-xs font-mono">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {!isLoading && reports.length === 0 && <tr><td colSpan="4" className="text-center py-16 text-slate-500"><ShieldAlert size={32} className="mx-auto mb-3 opacity-20"/> No pending reports. Platform is safe.</td></tr>}
          </tbody>
        </table>
      </div>
      <ConfirmModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({isOpen: false, action: null})} onConfirm={executeBulkAction} title={`Confirm Action`} message={`Apply ${confirmModal.action} to ${selectedIds.length} reports?`} isDanger={confirmModal.action === 'BAN_USER'} />
    </motion.div>
  );
};
export default AdminModeration;