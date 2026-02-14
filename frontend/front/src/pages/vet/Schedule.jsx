import React, { useState } from 'react';
// FIX: Added 'Stethoscope' to the imports below
import { Calendar as CalIcon, Clock, Video, MapPin, MoreVertical, CheckCircle, XCircle, Stethoscope } from 'lucide-react';

const Schedule = () => {
  const [view, setView] = useState('day');
  const [isAvailable, setIsAvailable] = useState(true);

  const appointments = [
    { id: 1, time: '09:00 AM', pet: 'Bella', owner: 'Aditya P.', type: 'General Checkup', mode: 'In-Clinic', status: 'Confirmed' },
    { id: 2, time: '10:30 AM', pet: 'Rocky', owner: 'Sarah J.', type: 'Vaccination', mode: 'Video Call', status: 'Pending' },
    { id: 3, time: '02:00 PM', pet: 'Luna', owner: 'Mike R.', type: 'Dental Cleaning', mode: 'In-Clinic', status: 'Confirmed' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Appointments List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Schedule</h1>
          <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <button onClick={() => setView('day')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'day' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500'}`}>Day</button>
            <button onClick={() => setView('week')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'week' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500'}`}>Week</button>
          </div>
        </div>

        <div className="space-y-4">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:shadow-md transition-all">
              <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase">{apt.time.split(' ')[1]}</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{apt.time.split(' ')[0]}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{apt.pet}</h3>
                  <span className="text-sm text-slate-500">owned by {apt.owner}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                    apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {apt.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Stethoscope className="w-3 h-3" /> {apt.type}</span>
                  <span className="flex items-center gap-1">
                    {apt.mode === 'Video Call' ? <Video className="w-3 h-3 text-blue-500" /> : <MapPin className="w-3 h-3 text-red-500" />} 
                    {apt.mode}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors">
                  Start
                </button>
                <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Availability Panel */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm sticky top-24">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Availability Settings</h3>
          
          <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Accepting Appointments</span>
            <button 
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${isAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Working Hours</label>
              <div className="flex items-center gap-2 mt-2">
                <input type="time" defaultValue="09:00" className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent text-sm dark:text-white" />
                <span className="text-slate-400">-</span>
                <input type="time" defaultValue="17:00" className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent text-sm dark:text-white" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Break Time</label>
              <div className="flex items-center gap-2 mt-2">
                <input type="time" defaultValue="13:00" className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent text-sm dark:text-white" />
                <span className="text-slate-400">-</span>
                <input type="time" defaultValue="14:00" className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent text-sm dark:text-white" />
              </div>
            </div>
            <button className="w-full mt-2 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-lg">
              Update Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;