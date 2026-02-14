import React from 'react';
import { Calendar, Bell, Activity } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Welcome back, Aditya! Here's your pet summary.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Appointment */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-cyan-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-cyan-100 text-sm font-medium mb-1">Upcoming Appointment</p>
              <h3 className="text-xl font-bold">Dr. Sarah Smith</h3>
              <p className="text-sm opacity-90 mt-1">Tomorrow, 10:00 AM</p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
             <button className="flex-1 py-1.5 bg-white text-cyan-700 rounded-lg text-sm font-bold shadow-sm">Details</button>
             <button className="flex-1 py-1.5 bg-cyan-700/50 text-white rounded-lg text-sm font-medium hover:bg-cyan-700/70">Reschedule</button>
          </div>
        </div>

        {/* Health Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Health Alerts</p>
              <h3 className="text-2xl font-bold text-gray-900">1 Pending</h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Bell className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs text-amber-800 font-medium">⚠️ Luna's Vaccination is due in 3 days.</p>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
             <p className="text-gray-500 text-sm font-medium">Recent Activity</p>
             <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <ul className="space-y-3">
             <li className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></div>
                <span className="text-gray-600">Appointment booked for <strong>Bella</strong></span>
             </li>
             <li className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <span className="text-gray-600">Purchased <strong>Dog Food</strong></span>
             </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;