import React from 'react';

const Appointments = () => {
  const appointments = [
    { id: 1, doctor: 'Dr. Sarah Smith', date: 'Oct 24, 2025', time: '10:00 AM', type: 'Checkup', status: 'Confirmed' },
    { id: 2, doctor: 'Dr. John Doe', date: 'Oct 12, 2025', time: '02:30 PM', type: 'Vaccination', status: 'Completed' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">My Appointments</h1>
        <button className="text-sm text-cyan-600 font-medium hover:text-cyan-800">History</button>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
          <tr>
            <th className="px-6 py-3">Doctor</th>
            <th className="px-6 py-3">Date & Time</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {appointments.map((apt) => (
            <tr key={apt.id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4 font-medium text-gray-900">{apt.doctor}</td>
              <td className="px-6 py-4 text-gray-600">{apt.date} <span className="text-gray-400">at</span> {apt.time}</td>
              <td className="px-6 py-4">{apt.type}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  apt.status === 'Confirmed' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {apt.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-gray-400 hover:text-cyan-600 font-medium">Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;