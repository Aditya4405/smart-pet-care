import React from 'react';
import { Outlet } from 'react-router-dom';
import VetSidebar from '../components/vet/VetSidebar';
import Topbar from '../components/admin/Topbar';

const VetLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-gray-900">
      <VetSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default VetLayout;