import React, { useState } from 'react';
import { Save, CalendarCheck, X } from 'lucide-react';

const ConsultationForm = ({ isOpen, onClose, onComplete }) => {
  if (!isOpen) return null;

  const [notes, setNotes] = useState('');
  const [enableFollowUp, setEnableFollowUp] = useState(false);
  const [days, setDays] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({ notes, enableFollowUp, days });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
           <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
             <CalendarCheck className="w-5 h-5 text-emerald-600" /> Complete Visit
           </h3>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Clinical Notes</label>
            <textarea 
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              rows="3"
              placeholder="Diagnosis & Prescription..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Follow Up Toggle */}
          <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
               <span className="font-bold text-slate-900 dark:text-white text-sm">Enable Free Follow-Up?</span>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" checked={enableFollowUp} onChange={(e) => setEnableFollowUp(e.target.checked)} className="sr-only peer" />
                 <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
               </label>
            </div>
            
            {enableFollowUp && (
               <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                 <label className="text-xs font-bold text-slate-500 uppercase">Valid For (Days)</label>
                 <div className="flex items-center gap-2 mt-1">
                   <input 
                     type="number" 
                     value={days} 
                     onChange={(e) => setDays(e.target.value)} 
                     className="w-20 p-2 text-center border border-slate-200 rounded-lg font-bold"
                   />
                   <span className="text-sm text-slate-500">days</span>
                 </div>
               </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95">
               <Save className="w-4 h-4" /> Save & Complete
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ConsultationForm;