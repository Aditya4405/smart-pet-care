import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, CheckCircle, AlertTriangle, Shield, Info } from 'lucide-react';

const Topbar = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { firstName: 'Admin', lastName: 'User' };
  
  // --- NOTIFICATION STATE ---
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // --- FETCH LATEST LOGS FOR NOTIFICATIONS ---
  const fetchRecentLogs = async () => {
    try {
      const res = await fetch('http://localhost:8082/api/admin/audit-logs', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Sort newest first, take the top 5
        const sorted = data.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
        setNotifications(sorted);
        // Simulate having new unread notifications if there is data
        setUnreadCount(sorted.length > 0 ? sorted.length : 0);
      }
    } catch (e) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchRecentLogs();
    
    // Set up a polling interval to check for new notifications every 30 seconds
    const interval = setInterval(fetchRecentLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- CLICK OUTSIDE TO CLOSE DROPDOWN ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setUnreadCount(0); // Clear the red dot when opened
    }
  };

  const getIconForSeverity = (sev) => {
      if(sev === 'CRITICAL') return <Shield className="w-4 h-4 text-red-500" />;
      if(sev === 'WARNING') return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      return <Info className="w-4 h-4 text-blue-500" />;
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-40 sticky top-0 shadow-sm">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="Search users, appointments, or logs..."
          />
        </div>
      </div>

      <div className="ml-4 flex items-center gap-4">
        
        {/* --- NOTIFICATION BELL --- */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={handleBellClick}
            className="relative p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none"
          >
            {unreadCount > 0 && (
                <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 ring-2 ring-white text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
            )}
            <Bell className="h-5 w-5" />
          </button>

          {/* --- DROPDOWN MENU --- */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Recent</span>
              </div>
              
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">No new notifications.</div>
                ) : (
                  notifications.map((notif, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3">
                      <div className={`mt-0.5 p-2 rounded-full shrink-0 h-fit ${
                          notif.severity === 'CRITICAL' ? 'bg-red-50' : 
                          notif.severity === 'WARNING' ? 'bg-amber-50' : 'bg-blue-50'
                      }`}>
                        {getIconForSeverity(notif.severity)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 leading-snug">{notif.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(notif.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-3 border-t border-gray-100 text-center bg-gray-50/50">
                <button 
                    onClick={() => { setShowDropdown(false); window.location.href = '/admin/audit-logs'; }}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View All Audit Logs
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-gray-200 mx-2" />
        
        <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
            {user.firstName[0]}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-gray-700 leading-none">{user.firstName} {user.lastName}</p>
            <p className="text-xs font-medium text-gray-500 mt-1">Super Admin</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;