import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Heart, Calendar, FileText, ShoppingBag, CreditCard, Settings, LogOut 
} from 'lucide-react';

const UserSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/profile' }, // Default user route
    { icon: Heart, label: 'My Pets', path: '/user/pets' },
    { icon: Calendar, label: 'Appointments', path: '/user/appointments' },
    { icon: FileText, label: 'Health Records', path: '/user/records' },
    { icon: ShoppingBag, label: 'Marketplace', path: '/user/shop' },
    { icon: CreditCard, label: 'Payments', path: '/user/payments' },
    { icon: Settings, label: 'Settings', path: '/user/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <span className="font-bold text-gray-800 tracking-tight">Pet Portal</span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive 
                ? 'bg-cyan-50 text-cyan-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;