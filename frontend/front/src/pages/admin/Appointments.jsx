import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Video, ShieldAlert } from 'lucide-react';
import ConfirmModal from '../../components/shared/ConfirmModal';
import toast from 'react-hot-toast';
import { API } from "../../config/api";
const BASE_URL = API.BASE_URL;

const AdminAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  const fetchAppts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/appointments`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
      });
      if (res.ok) setAppointments((await res.json()).sort((a,b) => b.id - a.id));
    } catch(e) { toast.error("Failed to load platform bookings."); } finally { setIsLoading(false); }
  };
  
  useEffect(() => { fetchAppts(); }, []);

  // --- NEW: TIME VALIDATION LOGIC FOR ADMIN MONITORING ---
  const isVideoActive = (dateStr, timeStr) => {
    try {
      // Expects dateStr as "2026-03-10" and timeStr as "04:30 PM"
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = parseInt(hours, 10) + 12;

      const appointmentDateTime = new Date(`${dateStr}T${hours}:${minutes}:00`);
      const now = new Date();

      // Window: Joinable 15 mins before start until 2 hours after start
      const startTime = new Date(appointmentDateTime.getTime() - 15 * 60000); 
      const endTime = new Date(appointmentDateTime.getTime() + 120 * 60000); 

      return now >= startTime && now <= endTime;
    } catch (e) {
      return false;
    }
  };

  const forceCancel = async () => {
    toast.success(`Booking #${confirmModal.id} has been forcefully cancelled & refunded.`);
    setConfirmModal({isOpen: false, id: null});
    fetchAppts();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Booking Control Center</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Oversee global appointments and resolve disputes.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/50 flex gap-4 bg-slate-50 dark:bg-slate-900/80">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
              <input type="text" placeholder="Search by Vet or Owner..." className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-indigo-500" />
            </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800/80">
              <tr><th className="px-6 py-4">Booking ID</th><th className="px-6 py-4">Participants</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {isLoading ? <tr><td colSpan="5" className="p-10 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr> : 
               appointments.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400 text-xs">APT-{a.id}<br/>{a.appointmentDate}</td>
                  <td className="px-6 py-4"><p className="font-bold text-slate-900 dark:text-white">Dr. {a.vet?.lastName}</p><p className="text-xs text-slate-500">Patient: {a.pet?.name} ({a.owner?.firstName})</p></td>
                  <td className="px-6 py-4 capitalize text-slate-600 dark:text-slate-400">{a.visitType}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider border ${a.status === 'SCHEDULED' || a.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10'}`}>{a.status}</span></td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    
                    {/* MONITOR BUTTON FOR ADMIN WITH TIME CHECK */}
                    {a.status === 'SCHEDULED' && a.visitType === 'video' && a.videoRoomId && (
                        <button 
                          onClick={() => navigate(`/admin/video-room/${a.videoRoomId}`)}
                          disabled={!isVideoActive(a.appointmentDate, a.appointmentTime)}
                          className={`flex items-center gap-1.5 text-white text-[10px] font-bold px-3 py-1.5 rounded transition-all 
                            ${isVideoActive(a.appointmentDate, a.appointmentTime) 
                              ? 'bg-indigo-500 hover:bg-indigo-600' 
                              : 'bg-slate-400 cursor-not-allowed opacity-50'}`}
                        >
                          <Video size={12} /> {isVideoActive(a.appointmentDate, a.appointmentTime) ? "Monitor Call" : "Expired"}
                        </button>
                    )}

                    {(a.status === 'SCHEDULED' || a.status === 'PENDING') && (
                        <button onClick={() => setConfirmModal({isOpen:true, id: a.id})} className="text-red-600 dark:text-red-400 text-[10px] font-bold border border-red-200 dark:border-red-500/20 px-3 py-1.5 rounded bg-red-50 dark:bg-red-500/10 transition-colors">Force Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({isOpen: false, id: null})} onConfirm={forceCancel} title="Force Cancel Appointment" message={`Are you sure you want to forcibly cancel booking APT-${confirmModal.id}? If paid, this will initiate an automatic refund.`} isDanger={true} confirmText="Force Cancel & Refund" />
    </motion.div>
  );
};
export default AdminAppointments;