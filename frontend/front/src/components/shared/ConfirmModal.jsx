import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isDanger = false }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200]" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-[30%] left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[201] overflow-hidden p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${isDanger ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-500'}`}><AlertTriangle size={24} /></div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm mb-6">{message}</p>
              <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition-colors">Cancel</button>
                <button onClick={() => { onConfirm(); onClose(); }} className={`px-4 py-2 text-white rounded-lg text-sm font-bold shadow-lg transition-colors ${isDanger ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/20'}`}>{confirmText}</button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
export default ConfirmModal;