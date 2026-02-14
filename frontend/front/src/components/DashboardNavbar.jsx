import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardNavbar = () => {
  const navigate = useNavigate();
  // Get user info safely
  const user = JSON.parse(localStorage.getItem('user')) || { firstName: 'User', role: 'Guest' };

  const handleLogout = () => {
      localStorage.removeItem('user');
      navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      
      {/* Search Bar */}
      <div className="relative w-full max-w-md hidden md:block">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm outline-none transition-colors"
          placeholder="Search..."
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-2" />
        
        <div onClick={handleLogout} className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors group">
          <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold border border-cyan-200 uppercase">
            {user.firstName ? user.firstName[0] : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-gray-700 leading-none group-hover:text-cyan-700">{user.firstName}</p>
            <p className="text-xs text-gray-500 mt-0.5 capitalize">{user.role}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;