import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarCheck, Users, ClipboardList, 
  BarChart2, DollarSign, Clock, Settings, LogOut 
} from 'lucide-react';

const VetSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/profile' }, // Default vet route
    { icon: CalendarCheck, label: 'Appointments', path: '/vet/appointments' },
    { icon: Users, label: 'Patients', path: '/vet/patients' },
    { icon: ClipboardList, label: 'Prescriptions', path: '/vet/prescriptions' },
    { icon: BarChart2, label: 'Analytics', path: '/vet/analytics' },
    { icon: DollarSign, label: 'Earnings', path: '/vet/earnings' },
    { icon: Clock, label: 'Availability', path: '/vet/schedule' },
    { icon: Settings, label: 'Settings', path: '/vet/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-lg">V</span>
        </div>
        <span className="font-bold text-white tracking-tight">Vet Console</span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                : 'hover:bg-slate-800 hover:text-white'}
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default VetSidebar;