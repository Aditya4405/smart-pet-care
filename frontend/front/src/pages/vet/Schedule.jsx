import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, FileText, CheckCircle, Stethoscope } from 'lucide-react';
import ConsultationForm from '../../components/vet/ConsultationForm';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const VetSchedule = () => {
  const navigate = useNavigate();

  // --- STATE FOR REAL DATA ---
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchVetAppointments = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userStr || !token) {
          navigate('/login');
          return;
        }

        const vetUser = JSON.parse(userStr);

        const response = await fetch(`http://localhost:8082/api/appointments/vet/${vetUser.id}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          const sortedData = data.sort((a, b) => b.id - a.id);
          setAppointments(sortedData);
        } else {
          toast.error("Failed to load your schedule.");
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVetAppointments();
  }, [navigate]);

  const handleOpenCompleteForm = (appt) => {
    setSelectedAppointment(appt);
    setIsFormOpen(true);
  };

  // --- NEW: SENDS UPDATE TO SPRING BOOT ---
  const handleCompleteVisit = async (data) => {
    try {
        const token = localStorage.getItem('token');
        
        // 1. Send the data to your new Spring Boot endpoint
        const response = await fetch(`http://localhost:8082/api/appointments/${selectedAppointment.id}/complete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // 2. If backend saves successfully, update the UI
            setAppointments(prev => prev.map(a => a.id === selectedAppointment.id ? { ...a, status: 'COMPLETED' } : a));
            toast.success(data.enableFollowUp ? `Visit Completed. Follow-up enabled.` : "Visit completed.");
            setIsFormOpen(false);
        } else {
            const errorText = await response.text();
            toast.error("Failed to save: " + errorText);
        }
    } catch (error) {
        console.error("Error completing visit:", error);
        toast.error("Network error while trying to complete visit.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Schedule</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your appointments for today.</p>
        </div>
        <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <Calendar className="w-5 h-5 text-slate-500" />
        </div>
      </div>

      {isLoading ? (
          <div className="flex justify-center items-center h-48">
             <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
      ) : appointments.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your schedule is clear!</h3>
              <p className="text-slate-500">No appointments have been booked with you yet.</p>
          </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-all">
              
              {/* Time Column */}
              <div className="flex flex-col items-center min-w-[90px]">
                 <span className="text-xs font-bold text-slate-500 mb-1">{appt.appointmentDate}</span>
                 <span className="text-sm font-bold text-slate-900 dark:text-white">{appt.appointmentTime}</span>
                 <div className="h-full w-0.5 bg-slate-100 dark:bg-slate-700 mt-2 hidden md:block"></div>
              </div>

              {/* Info Column */}
              <div className="flex-1 flex items-center gap-4 w-full">
                 <img 
                    src={appt.pet.imageUrl ? `http://localhost:8082/uploads/${appt.pet.imageUrl}` : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80'} 
                    alt={appt.pet.name} 
                    className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-slate-100" 
                 />
                 <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {appt.pet.name} <span className="text-sm font-medium text-slate-500">({appt.owner.firstName} {appt.owner.lastName})</span>
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md truncate mb-2 mt-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Notes: </span>
                        {appt.symptoms || "Routine Checkup"}
                    </p>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 uppercase">{appt.visitType}</span>
                       <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1 uppercase ${appt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          {appt.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                          {appt.status}
                       </span>
                    </div>
                 </div>
              </div>

              {/* Actions Column */}
              <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 justify-end">
                 
                 {/* Show Document Button if Owner uploaded a Medical Report */}
                 {appt.medicalReportUrl && (
                     <a href={`http://localhost:8082/uploads/${appt.medicalReportUrl}`} target="_blank" rel="noreferrer" title="View Medical Report" className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-500 hover:text-emerald-600 transition-colors border border-slate-200 dark:border-slate-600">
                        <FileText className="w-5 h-5" />
                     </a>
                 )}

                 {appt.visitType === 'video' && (
                     <button title="Join Video Call" className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200 dark:border-blue-800">
                        <Video className="w-5 h-5" />
                     </button>
                 )}
                 
                 {/* COMPLETE BUTTON */}
                 {appt.status !== 'COMPLETED' ? (
                     <button 
                       onClick={() => handleOpenCompleteForm(appt)}
                       className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
                     >
                        <Stethoscope className="w-4 h-4" /> Complete
                     </button>
                 ) : (
                     <button disabled className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 cursor-not-allowed">
                        <CheckCircle className="w-4 h-4" /> Done
                     </button>
                 )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- INTEGRATED CONSULTATION FORM --- */}
      {isFormOpen && (
        <ConsultationForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onComplete={handleCompleteVisit} 
        />
      )}

    </div>
  );
};

export default VetSchedule;