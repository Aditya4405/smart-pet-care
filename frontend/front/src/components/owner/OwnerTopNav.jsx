import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Bell, ChevronDown, User, Settings, LogOut, 
  PawPrint, Moon, Sun, Calendar, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { API } from '../../config/api';

const OwnerTopNav = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  
  const user = JSON.parse(localStorage.getItem('user')) || { id: 1, firstName: 'Pet', lastName: 'Owner' };
  
  // ✅ CLEAN ID FIX
  const cleanId = user.id ? String(user.id).split(':')[0] : null;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!cleanId || !token) return;

        // ✅ DYNAMIC URL FIX
        const response = await fetch(`${API.BASE_API}/appointments/owner/${cleanId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const appts = await response.json();
          const readNotifIds = JSON.parse(localStorage.getItem('readNotifications')) || [];
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const upcomingOrPending = appts.filter(a => a.status === 'SCHEDULED' || a.status === 'ACCEPTED');
          
          const dynamicNotifs = upcomingOrPending.map(appt => {
              const notifId = `appt-${appt.id}-${appt.status}`; 
              
              const appointmentDate = new Date(appt.appointmentDate);
              appointmentDate.setHours(0, 0, 0, 0);

              const isPast = appointmentDate < today;
              const isToday = appointmentDate.getTime() === today.getTime();

              let notifTitle = 'Upcoming Appointment';
              let notifMessage = `${appt.pet?.name || 'Your pet'} has a visit with Dr. ${appt.vet?.lastName || 'Vet'} on ${appt.appointmentDate}.`;
              
              if (isPast) {
                  notifTitle = 'Past Appointment';
                  notifMessage = `The scheduled visit for ${appt.pet?.name} on ${appt.appointmentDate} has passed.`;
              } else if (isToday) {
                  notifTitle = 'Appointment Today!';
                  notifMessage = `Reminder: ${appt.pet?.name} has a visit with Dr. ${appt.vet?.lastName} today!`;
              } else if (appt.status === 'ACCEPTED') {
                  notifTitle = 'Action Required: Payment';
                  notifMessage = `Dr. ${appt.vet?.lastName} accepted your request for ${appt.pet?.name}! Please complete payment to confirm.`;
              }

              return {
                  id: notifId,
                  type: isPast ? 'alert' : 'appointment',
                  title: notifTitle,
                  message: notifMessage,
                  time: appt.appointmentTime,
                  read: readNotifIds.includes(notifId)
              };
          });

          // ✅ MOCK DATA REMOVED! Only setting real dynamic notifications now.
          setNotifications(dynamicNotifs);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [cleanId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNotificationClick = (notif) => {
      const updatedNotifs = notifications.map(n => 
          n.id === notif.id ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifs);

      const readNotifIds = JSON.parse(localStorage.getItem('readNotifications')) || [];
      if (!readNotifIds.includes(notif.id)) {
          localStorage.setItem('readNotifications', JSON.stringify([...readNotifIds, notif.id]));
      }

      setIsNotifOpen(false);

      if (notif.title.toLowerCase().includes('appointment') || notif.title.includes('Payment')) {
        navigate('/owner/appointments'); 
      } 
      else if (notif.type === 'alert') {
        navigate('/owner/pets');
      }
  };

  const markAllAsRead = () => {
      const updated = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updated);
      const allIds = updated.map(n => n.id);
      localStorage.setItem('readNotifications', JSON.stringify(allIds));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { name: 'Dashboard', path: '/owner/dashboard' },
    { name: 'Find Vet', path: '/owner/doctors' },
    { name: 'My Pets', path: '/owner/pets' },
    { name: 'Marketplace', path: '/owner/marketplace' },
    { name: 'My Orders', path: '/owner/orders' },
    { name: 'Appointments', path: '/owner/appointments' },
    { name: 'Support', path: '/owner/support' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/owner/dashboard')}>
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all duration-300">
              <PawPrint className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">PetCare</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 p-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                  isNotifOpen 
                    ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400' 
                    : 'text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20'
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                   <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 flex items-center gap-1 transition-colors">
                        <CheckCircle className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto overscroll-contain">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                        <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">You have no new notifications.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {notifications.map((notif) => (
                          <div 
                             key={notif.id} 
                             onClick={() => handleNotificationClick(notif)}
                             className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-4 ${!notif.read ? 'bg-cyan-50/30 dark:bg-cyan-900/10' : ''}`}
                          >
                             <div className={`mt-1 shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notif.type === 'alert' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400'}`}>
                                 {notif.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                             </div>
                             <div>
                               <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  {notif.title}
                                  {!notif.read && <span className="w-2 h-2 rounded-full bg-cyan-500"></span>}
                               </p>
                               <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">{notif.message}</p>
                               <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-2">{notif.time}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border transition-all duration-200 ${
                  isDropdownOpen 
                    ? 'bg-white dark:bg-slate-800 border-cyan-500/30 ring-2 ring-cyan-500/10' 
                    : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 flex items-center justify-center text-cyan-700 dark:text-cyan-300 font-bold text-sm shadow-sm uppercase">
                  {user.firstName ? user.firstName[0] : 'U'}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-black/5 z-50">
                  <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Pet Owner</p>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    <button onClick={() => { setIsDropdownOpen(false); navigate('/owner/profile'); }} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-3">
                      <User className="w-4 h-4 text-slate-400" /> My Profile
                    </button>
                    <button onClick={() => { setIsDropdownOpen(false); navigate('/owner/settings'); }} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-3">
                      <Settings className="w-4 h-4 text-slate-400" /> Settings
                    </button>
                    <button onClick={toggleTheme} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-3">
                      {theme === 'dark' ? <Sun className="w-4 h-4 text-slate-400" /> : <Moon className="w-4 h-4 text-slate-400" />} 
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 p-2">
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors flex items-center gap-3">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default OwnerTopNav;