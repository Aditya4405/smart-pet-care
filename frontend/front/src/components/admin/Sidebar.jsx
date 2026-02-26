import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Stethoscope, Users, Calendar, 
  ShoppingBag, BarChart3, Settings, LogOut, DollarSign, 
  ShieldAlert, LifeBuoy, FileText
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // EVERY PATH HERE MUST MATCH APP.JSX EXACTLY!
  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Stethoscope, label: 'Doctor Approvals', path: '/admin/doctors' },
    { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
    { icon: ShoppingBag, label: 'Marketplace', path: '/admin/marketplace' },
    { icon: DollarSign, label: 'Financials', path: '/admin/financials' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: ShieldAlert, label: 'Moderation', path: '/admin/moderation' },
    { icon: LifeBuoy, label: 'Support', path: '/admin/support' },
    { icon: FileText, label: 'Audit Logs', path: '/admin/audit-logs' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 overflow-y-auto">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <span className="font-bold text-white tracking-tight">AdminPanel</span>
      </div>

      <div className="flex-1 py-6 px-3">
        <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;