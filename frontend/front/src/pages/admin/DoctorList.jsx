import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { API } from "../../config/api";
const BASE_API = API.BASE_API;
const UPLOADS = API.UPLOADS;

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState(null);

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${BASE_API}/admin/vets`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }});
      if (res.ok) {
        const data = await res.json();
        setDoctors(data.filter(vet => vet.status === 'PENDING'));
      }
    } catch (e) { toast.error("Failed to load applicants."); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleStatusUpdate = async (id, statusAction) => {
    try {
      const res = await fetch(`${BASE_API}/admin/users/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ action: statusAction })
      });
      if (res.ok) { toast.success(`Doctor ${statusAction.toLowerCase()}ed!`); fetchDoctors(); }
    } catch (e) { toast.error("Network error."); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1200px] mx-auto pb-12">
      <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Identity Verification</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review licenses and approve incoming veterinarian applications.</p>
      </div>

      {loading ? <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div> : 
      doctors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm dark:shadow-lg">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 border border-emerald-100 dark:border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={32} /></div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Inbox Zero</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">All doctor verifications have been processed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doc) => (
            <motion.div layout key={doc.id} className="bg-white dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-white rounded-xl flex items-center justify-center font-bold text-2xl uppercase">{doc.firstName[0]}</div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Dr. {doc.firstName} {doc.lastName}</h3>
                        <p className="text-sm font-mono text-slate-500">{doc.email}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{doc.specialization || 'General Practice'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                    {doc.certificateUrl && (
                        <button onClick={() => setPreviewDoc(doc.certificateUrl)} className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold text-sm rounded-xl flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700">
                            <FileText size={16}/> License
                        </button>
                    )}
                    <button onClick={() => handleStatusUpdate(doc.id, 'REJECT')} className="px-5 py-2.5 text-red-600 dark:text-red-400 font-bold text-sm bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 rounded-xl transition-colors">Reject</button>
                    <button onClick={() => handleStatusUpdate(doc.id, 'APPROVE')} className="px-6 py-2.5 text-white font-bold text-sm bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all">Verify & Approve</button>
                </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm z-[200]" onClick={() => setPreviewDoc(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[201] overflow-hidden flex flex-col h-[80vh]">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><FileText className="text-indigo-500 dark:text-indigo-400"/> Document Viewer</h3>
                <button onClick={() => setPreviewDoc(null)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={20}/></button>
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 overflow-auto flex justify-center">
                 <img src={`${UPLOADS}/${previewDoc}`} alt="Medical License" className="max-w-full rounded border border-slate-200 dark:border-slate-800 object-contain bg-white dark:bg-transparent" onError={(e) => e.target.src="https://via.placeholder.com/600x800.png?text=Document+Not+Found"} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default DoctorList;