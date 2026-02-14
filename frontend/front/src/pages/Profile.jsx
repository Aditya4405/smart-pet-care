import React, { useState } from 'react';
// ❌ Deleted: import Navbar from '../components/Navbar'; (Not needed anymore)

const Profile = () => {
  // Mock User Data (In real app, fetch from context/API)
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const role = user.role || 'USER';

  const [formData, setFormData] = useState({
    firstName: user.firstName || 'Aditya',
    lastName: user.lastName || 'Prajapati',
    email: user.email || 'aditya@example.com',
    phone: user.phone || '+91 98765 43210',
    location: 'Lucknow, India',
    gender: user.gender || 'Male',
    // Vet specific fields
    clinicName: user.clinicName || 'Paws & Claws Care',
    specialization: user.specialization || 'Dermatology',
    licenseNumber: user.licenseNumber || 'VET-UP-2026-X99',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your personal information and account security.</p>
        </div>
        <span className={`self-start px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${role === 'VET' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'}`}>
            {role === 'VET' ? 'Veterinarian' : 'Pet Owner'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === LEFT COLUMN: AVATAR CARD === */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
            <div className="h-24 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            <div className="px-6 relative text-center">
               <div className="-mt-12 mx-auto w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 flex items-center justify-center shadow-md text-3xl font-bold text-gray-400">
                  {formData.firstName[0]}{formData.lastName[0]}
               </div>
               <div className="py-6">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formData.firstName} {formData.lastName}</h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formData.email}</p>
               </div>
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN: EDIT FORM === */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Basic Information</h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="First Name" value={formData.firstName} />
                <InputGroup label="Last Name" value={formData.lastName} />
                
                <div className="col-span-1 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                    <input type="email" value={formData.email} readOnly className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-500 cursor-not-allowed"/>
                </div>

                <InputGroup label="Phone Number" value={formData.phone} />
                <InputGroup label="Location" value={formData.location} />
              </div>

              {/* VET ONLY SECTION */}
              {role === 'VET' && (
                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Professional Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Clinic Name" value={formData.clinicName} />
                    <InputGroup label="Specialization" value={formData.specialization} />
                    <div className="md:col-span-2"><InputGroup label="License Number" value={formData.licenseNumber} /></div>
                  </div>
                </div>
              )}
              
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-4">
                <button className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button className="px-8 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-500/30 transition-all active:scale-95">Save Changes</button>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
               <h3 className="font-bold text-lg text-gray-900 dark:text-white">Security</h3>
             </div>
             <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2"><InputGroup label="Current Password" type="password" placeholder="••••••••" /></div>
                <InputGroup label="New Password" type="password" placeholder="••••••••" />
                <InputGroup label="Confirm Password" type="password" placeholder="••••••••" />
                <div className="md:col-span-2 flex justify-end pt-4">
                    <button className="px-6 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold transition-colors">Change Password</button>
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