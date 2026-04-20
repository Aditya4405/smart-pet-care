// src/layouts/VetLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import VetTopNav from '../components/vet/VetTopNav'; 
import { ShieldAlert } from 'lucide-react';

const VetLayout = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPending = user.status === 'PENDING';
  const isRejected = user.status === 'REJECTED';

  return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-x-hidden">
      
      {/* 1. Background Ambience (Premium Gradient) */}
      <div className="fixed inset-0 z-[-1] min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pointer-events-none" />
      
      {/* 2. Subtle Green Radial Glow (Vet Theme) */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.08),transparent_40%)] dark:bg-[radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.15),transparent_40%)] pointer-events-none" />

      {/* 3. Top Navigation Bar */}
      <VetTopNav />
      
      {/* 4. Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 lg:pt-28 lg:pb-12 animate-in fade-in zoom-in-[0.99] duration-500 ease-out">
        {isPending ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-6 rounded-full mb-6">
              <ShieldAlert className="w-16 h-16 text-yellow-600 dark:text-yellow-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Account Under Verification</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
              Your veterinarian profile has been submitted successfully and is currently under admin verification. Please wait for admin approval to access your dashboard.
            </p>
          </div>
        ) : isRejected ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-full mb-6">
              <ShieldAlert className="w-16 h-16 text-red-600 dark:text-red-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Account Rejected</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
              Unfortunately, your verification was rejected. Please contact support.
            </p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default VetLayout;