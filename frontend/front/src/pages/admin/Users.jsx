import React, { useState } from 'react';
import { 
  Search, Filter, MoreVertical, Shield, Mail, 
  Smartphone, Lock, Ban, CheckCircle 
} from 'lucide-react';

const Users = () => {
  const [filter, setFilter] = useState('All');

  // Mock User Data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Owner", status: "Active", joinDate: "Oct 24, 2023" },
    { id: 2, name: "Dr. Sarah Smith", email: "sarah@vetclinic.com", role: "Vet", status: "Active", joinDate: "Nov 12, 2023" },
    { id: 3, name: "Mike Ross", email: "mike@example.com", role: "Owner", status: "Suspended", joinDate: "Jan 05, 2024" },
    { id: 4, name: "Emily Blunt", email: "emily@example.com", role: "Owner", status: "Active", joinDate: "Feb 10, 2024" },
    { id: 5, name: "Dr. House", email: "house@princeton.com", role: "Vet", status: "Pending", joinDate: "Feb 14, 2024" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage pet owners, doctors, and admin access.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-50">
             <Filter size={16} /> Filters
           </button>
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">
             + Add User
           </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name, email, or ID..." 
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700/50 uppercase text-xs font-bold text-slate-500">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    user.role === 'Vet' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${
                       user.status === 'Active' ? 'bg-emerald-500' : 
                       user.status === 'Suspended' ? 'bg-red-500' : 'bg-amber-500'
                     }`} />
                     <span className="font-medium text-slate-700 dark:text-slate-300">{user.status}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-slate-500 font-mono">
                  {user.joinDate}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;