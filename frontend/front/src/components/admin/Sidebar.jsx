import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Stethoscope, Store, 
  PackageSearch, BarChart3, Settings, LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Stethoscope, label: 'Doctor Approvals', path: '/admin/doctors' },
    { icon: Store, label: 'Marketplace Management', path: '/admin/marketplace' },
    { icon: PackageSearch, label: 'Orders', path: '/admin/orders' }, // NEW ORDERS LINK
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-slate-950 border-r border-slate-800 text-slate-300 h-screen overflow-y-auto sticky top-0">
      
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/60 shrink-0">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
          <span className="text-white font-extrabold text-xl tracking-tighter">SC</span>
        </div>
        <div>
          <span className="font-extrabold text-white text-lg tracking-tight block leading-none">SmartCare</span>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Admin Portal</span>
        </div>
      </div>

      <div className="flex-1 py-8 px-4">
        <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Menu</p>
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'}
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/60 mb-2">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;