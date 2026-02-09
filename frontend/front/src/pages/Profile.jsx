import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [role, setRole] = useState('vet'); // Toggle 'user' or 'vet'
  
  const [formData, setFormData] = useState({
    firstName: 'Aditya',
    lastName: 'Prajapati',
    email: 'aditya@example.com',
    phone: '+91 98765 43210',
    location: 'Lucknow, India',
    gender: 'Male',
    clinicName: 'Paws & Claws Care',
    specialization: 'Dermatology',
    licenseNumber: 'VET-UP-2026-X99',
    status: 'Approved'
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
      
      <Navbar />

      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        {/* Page Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your personal information and account security.</p>
          </div>
          
          {/* Demo Toggle */}
          <button 
            onClick={() => setRole(role === 'vet' ? 'user' : 'vet')}
            className="self-start px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors"
          >
            Switch View: {role === 'vet' ? 'Veterinarian' : 'Pet Owner'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* === LEFT COLUMN: ID CARD === */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-28">
              <div className="h-24 bg-gradient-to-r from-cyan-500 to-blue-600 relative"></div>
              <div className="px-6 relative">
                 <div className="-mt-12 w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 flex items-center justify-center shadow-md">
                    <span className="text-3xl font-bold text-gray-400">{formData.firstName[0]}{formData.lastName[0]}</span>
                    <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white dark:border-gray-800 hover:bg-blue-600 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                 </div>
              </div>
              <div className="px-6 pt-4 pb-8 text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formData.firstName} {formData.lastName}</h2>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${role === 'vet' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'}`}>
                  {role === 'vet' ? 'Veterinarian' : 'Pet Owner'}
                </span>
                <div className="mt-6 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-6">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Member Since</span>
                      <span className="font-medium text-gray-900 dark:text-white">Oct 2025</span>
                   </div>
                   {role === 'vet' && (
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Status</span>
                        <span className="flex items-center gap-1.5 font-bold text-green-600 dark:text-green-400">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>Approved
                        </span>
                     </div>
                   )}
                </div>
              </div>
            </div>
          </div>

          {/* === RIGHT COLUMN: FORMS === */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* CARD 1: Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Basic Information
                </h3>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="First Name" value={formData.firstName} />
                  <InputGroup label="Last Name" value={formData.lastName} />
                  
                  <div className="col-span-1 md:col-span-2">
                     <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                     <div className="relative mt-1">
                        <input type="email" value={formData.email} readOnly className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-500 cursor-not-allowed"/>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
                     </div>
                  </div>

                  <InputGroup label="Phone Number" value={formData.phone} />
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Gender</label>
                    <div className="relative mt-1">
                      <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none appearance-none">
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                    </div>
                  </div>
                </div>

                {role === 'vet' && (
                  <div className="animate-fadeIn pt-6 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                       <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                       Professional Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputGroup label="Clinic Name" value={formData.clinicName} />
                      <InputGroup label="Specialization" value={formData.specialization} />
                      <div className="md:col-span-2"><InputGroup label="License Number" value={formData.licenseNumber} /></div>
                    </div>
                  </div>
                )}
                
                <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-4">
                  <button className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                  <button className="px-8 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-95">Save Changes</button>
                </div>
              </div>
            </div>

            {/* CARD 2: Security & Password (NEW SECTION) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
               <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                   <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   Security & Password
                 </h3>
               </div>
               <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                     <InputGroup label="Current Password" type="password" placeholder="••••••••" />
                  </div>
                  <InputGroup label="New Password" type="password" placeholder="••••••••" />
                  <InputGroup label="Confirm Password" type="password" placeholder="••••••••" />
                  
                  <div className="md:col-span-2 flex justify-end pt-4">
                     <button className="px-6 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold transition-colors">
                       Change Password
                     </button>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, type="text", placeholder }) => (
  <div>
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{label}</label>
    <input 
      type={type} 
      defaultValue={value}
      placeholder={placeholder}
      className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-gray-400"
    />
  </div>
);

export default Profile;