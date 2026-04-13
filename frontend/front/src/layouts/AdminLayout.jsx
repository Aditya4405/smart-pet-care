import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Stethoscope, Calendar, ShoppingBag, PackageSearch,
  CreditCard, BarChart2, ShieldAlert, LifeBuoy, Settings, 
  FileText, LogOut, Search, Bell, ChevronLeft, ChevronRight, Zap, Activity, Sun, Moon,
  AlertTriangle, Shield, Info // <-- ADDED THESE FOR NOTIFICATIONS
} from 'lucide-react';
import { API } from "../config/api";

const BASE_API = API.BASE_API;

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  const navigate = useNavigate();
  const location = useLocation();

  // --- NOTIFICATION STATE ---
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // --- FETCH RECENT LOGS FOR NOTIFICATIONS ---
  const fetchRecentLogs = async () => {
    try {
      const res = await fetch(`${BASE_API}/admin/audit-logs`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        const sorted = data.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
        setNotifications(sorted);
        setUnreadCount(sorted.length > 0 ? sorted.length : 0);
      }
    } catch (e) { console.error("Failed to fetch notifications"); }
  };

  useEffect(() => {
    fetchRecentLogs();
    const interval = setInterval(fetchRecentLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- CLICK OUTSIDE TO CLOSE NOTIFICATIONS ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const user = JSON.parse(localStorage.getItem('user')) || { firstName: 'Aditya', lastName: 'Admin', role: 'SUPER_ADMIN', email: 'admin@smartpet.com' };
  const role = user.role.toUpperCase();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Stethoscope, label: 'Doctor Approvals', path: '/admin/doctors' },
    { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
    { icon: ShoppingBag, label: 'Marketplace', path: '/admin/marketplace' },
    { icon: PackageSearch, label: 'Orders', path: '/admin/orders' },
    { icon: CreditCard, label: 'Financials', path: '/admin/financials' },
    { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
    { icon: ShieldAlert, label: 'Moderation', path: '/admin/moderation' },
    { icon: LifeBuoy, label: 'Support', path: '/admin/support' },
    { icon: FileText, label: 'Audit Logs', path: '/admin/audit-logs' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getIconForSeverity = (sev) => {
      if(sev === 'CRITICAL') return <Shield className="w-4 h-4 text-red-500" />;
      if(sev === 'WARNING') return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      return <Info className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-300 flex overflow-hidden font-sans transition-colors duration-300">
      
      {/* COMMAND PALETTE */}
      <AnimatePresence>
        {showCommandPalette && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCommandPalette(false)} className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[101] overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <Search className="text-slate-400 mr-3" size={20} />
                <input autoFocus type="text" placeholder="Search pages, users, or settings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white text-lg placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                <kbd className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded text-xs font-mono border border-slate-200 dark:border-slate-700">ESC</kbd>
              </div>
              <div className="max-h-96 overflow-y-auto p-2">
                <p className="px-3 py-2 text-xs font-bold text-slate-500 uppercase">Quick Navigation</p>
                {menuItems.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                  <button key={item.path} onClick={() => { navigate(item.path); setShowCommandPalette(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors">
                    <item.icon size={18} /> {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside initial={false} animate={{ width: isCollapsed ? '80px' : '280px' }} className="flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-20 relative transition-all duration-300">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 rounded-full p-1 hover:text-indigo-600 dark:hover:text-white shadow-sm transition-colors z-50">
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(99,102,241,0.4)] shrink-0">
            <Zap className="text-white" size={16} />
          </div>
          {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-slate-900 dark:text-white whitespace-nowrap tracking-tight">PetCare <span className="text-slate-400 dark:text-slate-500 font-normal">OS</span></motion.span>}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} title={isCollapsed ? item.label : ""} className={({ isActive }) => `group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
              <item.icon size={18} className={`shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        
        {/* TOPBAR */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-md text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> PROD
            </div>
            <button onClick={() => setShowCommandPalette(true)} className="flex items-center gap-2 text-sm text-slate-500 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 px-4 py-1.5 rounded-lg hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-colors w-64 group">
              <Search size={14} className="group-hover:text-slate-700 dark:group-hover:text-slate-300" />
              <span>Search...</span>
              <kbd className="ml-auto bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-200 dark:border-slate-700">Ctrl K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mr-2 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors" title="API Status">
                <Activity size={14} className="text-emerald-500" /> 12ms
            </div>
            
            {/* --- NOTIFICATION BELL & DROPDOWN --- */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) setUnreadCount(0);
                }}
                className="relative text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors p-1"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-[8px] font-bold text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Recent</span>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 text-sm">No new notifications.</div>
                      ) : (
                        notifications.map((notif, i) => (
                          <div key={i} className="p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3">
                            <div className="mt-0.5 shrink-0">{getIconForSeverity(notif.severity)}</div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">{notif.action}</p>
                              <p className="text-xs text-slate-500 mt-1">{new Date(notif.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/50 text-center border-t border-slate-100 dark:border-slate-800">
                      <button 
                        onClick={() => { setShowNotifications(false); navigate('/admin/audit-logs'); }} 
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View All Logs
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
            
            {/* PROFILE DROPDOWN */}
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 cursor-pointer text-left focus:outline-none">
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight capitalize">{user.firstName}</p>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">{role.replace('_', ' ')}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 p-[2px] shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-white uppercase">
                    {user.firstName ? user.firstName[0] : 'A'}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{user.firstName} {user.lastName || ''}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <button onClick={toggleTheme} className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                          <span className="flex items-center gap-2.5">{theme === 'dark' ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-indigo-400" />} {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                          <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${theme === 'dark' ? 'left-4 translate-x-0.5' : 'left-0.5'}`}></div>
                          </div>
                        </button>
                        <button onClick={() => { navigate('/admin/settings'); setShowProfileMenu(false); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors mt-1"><Settings size={16} className="text-slate-400" /> System Settings</button>
                      </div>
                      <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"><LogOut size={16} /> Sign Out</button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;