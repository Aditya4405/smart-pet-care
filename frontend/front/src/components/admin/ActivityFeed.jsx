import React from 'react';
import { Activity } from 'lucide-react';

const ActivityFeed = () => {
  const activities = [
    { text: 'Dr. Sarah Smith registered', time: '2 min ago', color: 'bg-emerald-500' },
    { text: 'New appointment booked', time: '15 min ago', color: 'bg-blue-500' },
    { text: 'System backup completed', time: '1 hr ago', color: 'bg-gray-500' },
    { text: 'Aditya updated profile', time: '3 hrs ago', color: 'bg-indigo-500' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Live Activity</h3>
        <Activity className="w-4 h-4 text-gray-400" />
      </div>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {activities.map((item, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
               <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all">
              <div className="text-sm font-medium text-gray-900">{item.text}</div>
              <time className="text-xs font-medium text-gray-400">{item.time}</time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;