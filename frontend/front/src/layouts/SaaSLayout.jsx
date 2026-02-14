// src/layouts/SaaSLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from '../components/shared/TopNav';

const SaaSLayout = () => {
  return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 selection:bg-teal-500/30 selection:text-teal-900 dark:selection:text-teal-100 relative overflow-x-hidden">
      
      {/* 1. Layered Premium Background */}
      <div className="fixed inset-0 z-[-1] min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pointer-events-none" />
      
      {/* 2. Subtle Radial Highlight (The "Invisible" Glow) */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.08),transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.15),transparent_40%)] pointer-events-none" />

      <TopNav />
      
      {/* Main Content Workspace with Rhythm Spacing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 animate-in fade-in zoom-in-[0.99] duration-500 ease-out">
        <Outlet />
      </main>
    </div>
  );
};

export default SaaSLayout;