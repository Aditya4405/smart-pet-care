import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Patients = () => {
  const navigate = useNavigate();
  
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userStr || !token) {
          navigate('/login');
          return;
        }
        const user = JSON.parse(userStr);

        const response = await fetch(`http://localhost:8082/api/appointments/vet/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Use a Map to extract unique patients (Pets) from the appointments list
          const uniquePetsMap = new Map();
          
          data.forEach(appt => {
              if (!uniquePetsMap.has(appt.pet.id)) {
                  uniquePetsMap.set(appt.pet.id, {
                      id: appt.pet.id,
                      name: appt.pet.name,
                      owner: `${appt.owner.firstName} ${appt.owner.lastName}`,
                      species: appt.pet.species || 'Unknown',
                      breed: appt.pet.breed || 'Unknown',
                      lastVisit: appt.appointmentDate,
                      condition: appt.symptoms && appt.symptoms !== "No symptoms provided" ? appt.symptoms : "General Checkup",
                      status: 'ACTIVE', 
                      weight: appt.pet.weight || '-',
                      gender: appt.pet.gender || 'Unknown'
                  });
              } else {
                  // If we already added this pet, see if this appointment is newer
                  const existing = uniquePetsMap.get(appt.pet.id);
                  if (new Date(appt.appointmentDate) > new Date(existing.lastVisit)) {
                      existing.lastVisit = appt.appointmentDate;
                      existing.condition = appt.symptoms && appt.symptoms !== "No symptoms provided" ? appt.symptoms : existing.condition;
                  }
              }
          });

          setPatients(Array.from(uniquePetsMap.values()));
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to load patients.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [navigate]);

  const filteredPatients = patients.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patient Records</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
                type="text" 
                placeholder="Search patients or owners..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm w-64 focus:ring-2 focus:ring-emerald-500 outline-none text-white" 
            />
          </div>
          <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm min-h-[400px]">
        {isLoading ? (
            <div className="flex justify-center items-center h-48">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : filteredPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                <p>No patients found.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
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
                    {filteredPatients.map((p) => (
                      <tr key={p.id} onClick={() => setSelectedPatient(p)} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 dark:text-white capitalize">{p.name}</p>
                          <p className="text-xs text-slate-500 capitalize">{p.species} • {p.breed}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{p.owner}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{p.lastVisit}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[200px] truncate">{p.condition}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded text-xs font-bold uppercase border border-emerald-100 dark:border-emerald-800">
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 group-hover:text-emerald-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl p-6 md:p-8 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedPatient(null)} className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
            
            <div className="flex items-center gap-6 mb-8 mt-2">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-600 uppercase">
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{selectedPatient.name}</h2>
                <p className="text-slate-500 capitalize">{selectedPatient.species} - {selectedPatient.breed}</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded uppercase text-slate-500 border border-slate-200 dark:border-slate-700">
                      {selectedPatient.gender}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Diagnosis</p>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedPatient.condition}</p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Last Recorded Weight</p>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedPatient.weight} kg</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setSelectedPatient(null)} className="px-6 py-2.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold transition-colors">
                  Close
              </button>
              <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-transform active:scale-95">
                  Update Medical Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;