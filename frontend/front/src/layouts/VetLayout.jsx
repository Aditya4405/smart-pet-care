import React from 'react';
import { Outlet } from 'react-router-dom';
import VetTopNav from '../components/vet/VetTopNav'; // Ensure you have this file created

const VetLayout = () => {
  return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-x-hidden">
      
      {/* 1. Background Ambience (Premium Gradient) */}
      <div className="fixed inset-0 z-[-1] min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pointer-events-none" />
      
      {/* 2. Subtle Green Radial Glow (Vet Theme) */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.08),transparent_40%)] dark:bg-[radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.15),transparent_40%)] pointer-events-none" />

      {/* 3. Top Navigation Bar */}
      <VetTopNav />
      
      {/* 4. Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 animate-in fade-in zoom-in-[0.99] duration-500 ease-out">
        <Outlet />
      </main>
    </div>
  );
};

export default VetLayout;