import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const RecentTable = () => {
  const appointments = [
    { id: '#APT-001', doctor: 'Dr. Sarah Smith', user: 'Aditya P.', date: 'Oct 24, 2025', amount: '$45.00', status: 'Completed' },
    { id: '#APT-002', doctor: 'Dr. John Doe', user: 'Rahul K.', date: 'Oct 23, 2025', amount: '$60.00', status: 'Pending' },
    { id: '#APT-003', doctor: 'Dr. Emily W.', user: 'Priya S.', date: 'Oct 22, 2025', amount: '$35.00', status: 'Cancelled' },
    { id: '#APT-004', doctor: 'Dr. Sarah Smith', user: 'Amit B.', date: 'Oct 21, 2025', amount: '$45.00', status: 'Completed' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700';
      case 'Pending': return 'bg-amber-50 text-amber-700';
      case 'Cancelled': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Recent Appointments</h3>
        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Doctor</th>
              <th className="px-6 py-3">Pet Owner</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4">{item.doctor}</td>
                <td className="px-6 py-4">{item.user}</td>
                <td className="px-6 py-4 text-gray-500">{item.date}</td>
                <td className="px-6 py-4 font-medium">{item.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTable;