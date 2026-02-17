import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Stethoscope, Calendar, ShoppingBag, 
  CreditCard, BarChart2, ShieldAlert, LifeBuoy, Settings, 
  FileText, LogOut, Menu, X 
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Stethoscope, label: 'Doctor Approvals', path: '/admin/doctors' },
    { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
    { icon: ShoppingBag, label: 'Marketplace', path: '/admin/marketplace' },
    { icon: CreditCard, label: 'Financials', path: '/admin/payments' },
    { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
    { icon: ShieldAlert, label: 'Moderation', path: '/admin/moderation' },
    { icon: LifeBuoy, label: 'Support', path: '/admin/support' },
    { icon: FileText, label: 'Audit Logs', path: '/admin/audit-logs' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex font-sans text-slate-900 dark:text-slate-100">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex flex-col`}>
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3 font-bold text-white">A</div>
          <span className="font-bold text-lg tracking-tight">Admin<span className="text-indigo-400">Panel</span></span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto text-slate-400"><X size={20}/></button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">AD</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Super Admin</p>
              <p className="text-xs text-slate-500 truncate">admin@smartpet.com</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-red-900/20 hover:text-red-400 text-slate-400 text-sm font-bold transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center px-4 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-500 hover:text-slate-700">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-lg">Dashboard</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;