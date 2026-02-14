import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../components/user/UserSidebar';
import Topbar from '../components/admin/Topbar'; // Reusing the topbar for consistency

const UserLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;