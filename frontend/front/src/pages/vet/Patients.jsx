import React, { useState } from 'react';
import { Search, Filter, Eye, MoreHorizontal, X } from 'lucide-react';

const Patients = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patients = [
    { id: 1, name: 'Bella', owner: 'Aditya P.', species: 'Dog', breed: 'Golden Retriever', lastVisit: 'Feb 10, 2026', condition: 'Healthy', status: 'Active' },
    { id: 2, name: 'Luna', owner: 'Sarah J.', species: 'Cat', breed: 'Siamese', lastVisit: 'Jan 28, 2026', condition: 'Flu', status: 'Treatment' },
    { id: 3, name: 'Max', owner: 'Mike R.', species: 'Dog', breed: 'Bulldog', lastVisit: 'Feb 12, 2026', condition: 'Surgery Recovery', status: 'Critical' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patient Records</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search patients..." className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm w-64 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50">
            <Filter className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">Patient Name</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Last Visit</th>
              <th className="px-6 py-4">Condition</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {patients.map((p) => (
              <tr key={p.id} onClick={() => setSelectedPatient(p)} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.species} • {p.breed}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{p.owner}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{p.lastVisit}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">{p.condition}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    p.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                    p.status === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-emerald-600">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setSelectedPatient(null)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="w-5 h-5 text-slate-500" />
            </button>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-600">
                {selectedPatient.name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedPatient.name}</h2>
                <p className="text-slate-500">{selectedPatient.species} - {selectedPatient.breed}</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded uppercase text-slate-500">Male</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded uppercase text-slate-500">3 Years</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase">Recent Diagnosis</p>
                <p className="font-semibold text-slate-900 dark:text-white mt-1">{selectedPatient.condition}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase">Last Weight</p>
                <p className="font-semibold text-slate-900 dark:text-white mt-1">24.5 kg</p>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex justify-end gap-3">
              <button onClick={() => setSelectedPatient(null)} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold">Close</button>
              <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700">Add Medical Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;