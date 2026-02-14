import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Topbar = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { firstName: 'Admin', lastName: 'User' };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
      
      {/* Search Bar */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-colors"
            placeholder="Search admin data..."
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="ml-4 flex items-center gap-4">
        <button className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
          <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          <Bell className="h-5 w-5" />
        </button>

        <div className="h-8 w-px bg-gray-200 mx-2" />

        <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="h-8 w-8 rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold">
            {user.firstName ? user.firstName[0] : 'A'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-gray-700 leading-none">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-500 mt-1">Administrator</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;