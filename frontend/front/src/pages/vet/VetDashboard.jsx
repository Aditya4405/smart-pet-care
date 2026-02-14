import React from 'react';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard'; // Reuse
import RevenueChart from '../../components/vet/RevenueChart';

const VetDashboard = () => {
  const appointments = [
    { id: 1, patient: 'Bella', owner: 'Aditya', time: '10:00 AM', type: 'Checkup', status: 'Confirmed' },
    { id: 2, patient: 'Rocky', owner: 'Rahul', time: '11:30 AM', type: 'Vaccination', status: 'Pending' },
    { id: 3, patient: 'Max', owner: 'Priya', time: '02:00 PM', type: 'Surgery', status: 'Confirmed' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dr. Prajapati's Dashboard</h1>
          <p className="text-gray-500">Overview of your practice today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Manage Schedule
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Appointments Today" value="8" icon={Calendar} trend="12%" trendUp={true} color="bg-blue-500" />
        <StatsCard title="Total Patients" value="1,240" icon={Users} trend="4%" trendUp={true} color="bg-indigo-500" />
        <StatsCard title="Pending Requests" value="3" icon={Clock} trend="0%" trendUp={true} color="bg-amber-500" />
        <StatsCard title="Earnings (Today)" value="$450" icon={DollarSign} trend="8%" trendUp={true} color="bg-emerald-500" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Today's Schedule</h3>
            <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View Calendar</button>
          </div>
          <div className="divide-y divide-gray-100">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex flex-col items-center justify-center text-gray-600 font-medium text-xs border border-gray-200">
                    <span>{apt.time.split(' ')[0]}</span>
                    <span>{apt.time.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{apt.patient} <span className="text-gray-400 font-normal">({apt.owner})</span></h4>
                    <p className="text-sm text-gray-500">{apt.type}</p>
                  </div>
                </div>
                <div>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                     apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                   }`}>
                     {apt.status}
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="lg:col-span-1">
          <RevenueChart />
        </div>

      </div>
    </div>
  );
};

export default VetDashboard;