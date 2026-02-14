import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Make sure this is the User Sidebar
import DashboardNavbar from '../components/DashboardNavbar'; // <--- NEW IMPORT

const OwnerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar fixed to left */}
      <Sidebar /> 

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden ml-64">
        <DashboardNavbar /> {/* <--- NEW NAVBAR */}
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;