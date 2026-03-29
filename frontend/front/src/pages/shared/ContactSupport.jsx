import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, LifeBuoy, AlertCircle, MessageSquare, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { API } from '../../config/api';

const ContactSupport = () => {
  // 1. DYNAMICALLY PULL USER DATA AND ROLE
  const currentUser = JSON.parse(localStorage.getItem('user')) || { firstName: '', role: 'USER' };

  const [formData, setFormData] = useState({
    userName: currentUser.firstName,
    userRole: currentUser.role, // <-- NOW DYNAMIC! (Will be "VETERINARIAN", "VET", or "OWNER")
    priority: 'Normal',
    issue: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.issue) {
      toast.error("Please fill in your name and describe your issue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API.BASE_API}/actions/support/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success("Ticket submitted! Our admin team is on it.");
        setFormData({ ...formData, issue: '', priority: 'Normal' }); 
      } else {
        toast.error("Failed to submit ticket. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Ensure the backend server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Help & Support</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Having trouble? Open a ticket and our platform admins will resolve it.</p>
      </div>

      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800/50 bg-indigo-50/50 dark:bg-indigo-500/5 flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30 shadow-sm shrink-0">
            <LifeBuoy size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Submit a Ticket</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Average response time: &lt; 2 hours</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <User size={16} className="text-slate-400" /> Confirm your Name
            </label>
            <input 
              type="text" 
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <AlertCircle size={16} className="text-slate-400" /> Issue Priority
            </label>
            <div className="flex flex-wrap gap-3">
              {['Low', 'Normal', 'Urgent'].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({...formData, priority: level})}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                    formData.priority === level 
                      ? level === 'Urgent' 
                        ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 shadow-sm'
                        : 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MessageSquare size={16} className="text-slate-400" /> Describe your issue
            </label>
            <textarea 
              rows="5"
              placeholder="What seems to be the problem?"
              value={formData.issue}
              onChange={(e) => setFormData({...formData, issue: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Submit Ticket <Send size={18} /></>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactSupport;