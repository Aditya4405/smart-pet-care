import React, { useEffect, useState } from 'react';
import { Users, Stethoscope, AlertCircle, DollarSign } from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import AnalyticsChart from '../../components/admin/AnalyticsChart';
import RecentTable from '../../components/admin/RecentTable';
import ActivityFeed from '../../components/admin/ActivityFeed';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    pendingApprovals: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const authHeader = 'Basic ' + btoa(user.email + ":" + user.password);

    fetch('http://localhost:8082/api/admin/dashboard/stats', {
        headers: { 'Authorization': authHeader }
    })
    .then(res => res.ok ? res.json() : null)
    .then(data => {
        if(data) setStats(data);
    })
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all">
            + New Appointment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} trend="12.5%" trendUp={true} color="bg-blue-500" />
        <StatsCard title="Total Doctors" value={stats.totalDoctors} icon={Stethoscope} trend="8.2%" trendUp={true} color="bg-emerald-500" />
        <StatsCard title="Pending Reviews" value={stats.pendingApprovals} icon={AlertCircle} trend="2.4%" trendUp={false} color="bg-amber-500" />
        <StatsCard title="Monthly Revenue" value={`$${stats.monthlyRevenue}`} icon={DollarSign} trend="5.3%" trendUp={true} color="bg-indigo-500" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* Table */}
      <RecentTable />
    </div>
  );
};

export default Dashboard;