import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Shield, CheckCircle2, Ban, Trash2, X, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { API } from "../../config/api";

const BASE_API = API.BASE_API;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState([]);
  const [drawerUser, setDrawerUser] = useState(null);
  
  // NEW: State for the 3-dots dropdown menu
  const [openMenuId, setOpenMenuId] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const [ownersRes, vetsRes] = await Promise.all([
        fetch(`${BASE_API}/admin/users`, { headers }),
        fetch(`${BASE_API}/admin/vets`, { headers })
      ]);
      if (ownersRes.ok && vetsRes.ok) {
        const combined = [...await ownersRes.json(), ...await vetsRes.json()].sort((a, b) => b.id - a.id);
        setUsers(combined);
      }
    } catch (error) { toast.error("Failed to load global user registry."); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Bulk Action (Your existing logic)
  const handleBulkAction = async (action) => {
    if (!window.confirm(`Execute ${action} on ${selectedIds.length} users?`)) return;
    const token = localStorage.getItem('token');
    try {
      await Promise.all(selectedIds.map(id => 
       fetch(`${BASE_API}/admin/users/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ action: action === 'Suspend' ? 'SUSPEND' : 'ACTIVATE' })
        })
      ));
      toast.success(`Successfully updated ${selectedIds.length} records!`);
      setSelectedIds([]);
      fetchUsers();
    } catch (e) { toast.error("Bulk action failed."); }
  };

  // NEW: Individual Status Update (For the 3-dots menu)
  const handleIndividualStatusUpdate = async (e, userId, newStatus) => {
    e.stopPropagation(); // Prevent opening the side drawer
    try {
      const token = localStorage.getItem('token');
      
      // I am using the standard endpoint we built in UserController
      const response = await fetch(`${BASE_API}/users/${userId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success(`User status updated to ${newStatus}`);
        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        setOpenMenuId(null);
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-[1600px] mx-auto pb-12 relative">
      <div className="flex justify-between items-end">
        <div><h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Identity Management</h1><p className="text-slate-500 dark:text-slate-400 mt-1">Control platform access, verify credentials, and manage roles.</p></div>
      </div>

      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm dark:shadow-xl overflow-visible">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/50 flex flex-wrap justify-between items-center gap-4 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md"><Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} /><input type="text" placeholder="Search identities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-indigo-500 outline-none" /></div>
            <select value={roleFilter} onChange={(e)=>setRoleFilter(e.target.value)} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2 text-sm outline-none"><option value="ALL">All Roles</option><option value="VET">Veterinarians</option><option value="USER">Pet Owners</option></select>
          </div>
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 px-4 py-1.5 rounded-lg shadow-sm">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mr-2">{selectedIds.length} Selected</span>
                <button onClick={() => handleBulkAction('Suspend')} className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-500"><Ban size={14}/> Suspend</button>
                <button onClick={() => handleBulkAction('Activate')} className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"><CheckCircle2 size={14}/> Activate</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="overflow-x-auto min-h-[400px] pb-32">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950/50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800/80">
              <tr>
                <th className="px-6 py-4 w-10"><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? filtered.map(u => u.id) : [])} checked={selectedIds.length === filtered.length && filtered.length > 0} className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 accent-indigo-600 cursor-pointer" /></th>
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4 text-center">Security Role</th>
                <th className="px-6 py-4">System Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 relative">
              {isLoading ? <tr><td colSpan="5" className="p-10 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr> : 
               filtered.map((user) => (
                <tr key={user.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer ${selectedIds.includes(user.id) ? 'bg-indigo-50 dark:bg-indigo-500/5' : ''}`} onClick={() => setDrawerUser(user)}>
                  <td className="px-6 py-4" onClick={e=>e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => setSelectedIds(p => p.includes(user.id) ? p.filter(i=>i!==user.id) : [...p, user.id])} className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 accent-indigo-600 cursor-pointer"/></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white flex items-center justify-center font-bold shadow-inner uppercase border border-slate-200 dark:border-slate-700">{user.firstName[0]}</div>
                      <div><p className="font-bold text-slate-900 dark:text-white capitalize">{user.firstName} {user.lastName}</p><p className="text-xs text-slate-500 font-mono">{user.email}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${user.role === 'VET' ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20' : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'}`}>{user.role}</span></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' || user.status === 'APPROVED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : user.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'}`}></div><span className="font-bold text-slate-600 dark:text-slate-300 text-xs uppercase">{user.status || 'UNKNOWN'}</span></div></td>
                  
                  {/* UPDATED: Individual Actions Column */}
                  <td className="px-6 py-4 text-center relative" ref={openMenuId === user.id ? dropdownRef : null}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Don't open drawer
                        setOpenMenuId(openMenuId === user.id ? null : user.id);
                      }}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* The 3-Dots Dropdown Menu */}
                    {openMenuId === user.id && (
                      <div className="absolute right-12 top-8 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl py-2 z-50 animate-in zoom-in-95">
                        
                        {user.status === 'SUSPENDED' || user.status === 'BANNED' ? (
                          <button 
                            onClick={(e) => handleIndividualStatusUpdate(e, user.id, 'ACTIVE')}
                            className="w-full text-left px-4 py-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-2 transition-colors"
                          >
                            <CheckCircle2 size={16} /> Revoke Suspension
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={(e) => handleIndividualStatusUpdate(e, user.id, 'SUSPENDED')}
                              className="w-full text-left px-4 py-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center gap-2 transition-colors"
                            >
                              <Shield size={16} /> Suspend User
                            </button>
                            <button 
                              onClick={(e) => handleIndividualStatusUpdate(e, user.id, 'BANNED')}
                              className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                            >
                              <Ban size={16} /> Ban Permanently
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Identity Dossier Drawer */}
      <AnimatePresence>
        {drawerUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerUser(null)} className="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-[101] shadow-2xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Shield size={20} className="text-indigo-500"/> Identity Dossier</h2>
                <button onClick={() => setDrawerUser(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={16}/></button>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 text-center">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 uppercase">{drawerUser.firstName[0]}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{drawerUser.firstName} {drawerUser.lastName}</h3>
                <p className="text-sm text-slate-500 font-mono mt-1">{drawerUser.email}</p>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">ID: #{drawerUser.id}</span>
                  <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">ROLE: {drawerUser.role}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default AdminUsers;