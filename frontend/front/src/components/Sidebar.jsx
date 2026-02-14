import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Heart, Calendar, FileText, 
  ShoppingBag, CreditCard, Settings, LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/owner/dashboard' },
    { icon: Heart, label: 'My Pets', path: '/owner/pets' },
    { icon: Calendar, label: 'Appointments', path: '/owner/appointments' },
    { icon: FileText, label: 'Health Records', path: '/owner/health' },
    { icon: ShoppingBag, label: 'Marketplace', path: '/owner/marketplace' },
    { icon: CreditCard, label: 'Payments', path: '/owner/payments' },
    { icon: Settings, label: 'Settings', path: '/owner/settings' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-10">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <span className="font-bold text-gray-800 text-lg tracking-tight">Pet Portal</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
              ${isActive 
                ? 'bg-cyan-50 text-cyan-700 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <item.icon className={`w-5 h-5 mr-3 transition-colors ${
              // Simple logic to keep icon color consistent with text
              'text-current' 
            }`} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;