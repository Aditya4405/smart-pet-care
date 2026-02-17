import React, { useState } from 'react';
import { Calendar, Clock, Video, MapPin, MoreVertical, CheckCircle, XCircle, Stethoscope } from 'lucide-react';
import ConsultationForm from '../../components/vet/ConsultationForm';

const VetSchedule = () => {
  // State for the Consultation Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const appointments = [
    { id: 1, pet: 'Bella', owner: 'Aditya Prajapati', time: '10:00 AM', type: 'Checkup', status: 'Confirmed', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80' },
    { id: 2, pet: 'Max', owner: 'John Doe', time: '11:30 AM', type: 'Vaccination', status: 'Pending', img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=150&q=80' },
    { id: 3, pet: 'Luna', owner: 'Sarah Miller', time: '02:00 PM', type: 'Surgery', status: 'Confirmed', img: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=150&q=80' },
  ];

  const handleOpenCompleteForm = (appt) => {
    setSelectedAppointment(appt);
    setIsFormOpen(true);
  };

  const handleCompleteVisit = (data) => {
    console.log("Visit Completed for", selectedAppointment?.id, "Data:", data);
    // TODO: Send to backend
    alert(data.enableFollowUp ? `Visit Completed. Follow-up enabled for ${data.days} days.` : "Visit completed.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Schedule</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your appointments for today.</p>
        </div>
        <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <Calendar className="w-5 h-5 text-slate-500" />
        </div>
      </div>

      <div className="space-y-4">
        {appointments.map((appt) => (
          <div key={appt.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-all">
            
            {/* Time Column */}
            <div className="flex flex-col items-center min-w-[80px]">
               <span className="text-sm font-bold text-slate-500">{appt.time.split(' ')[0]}</span>
               <span className="text-xs font-bold text-slate-400">{appt.time.split(' ')[1]}</span>
               <div className="h-full w-0.5 bg-slate-100 dark:bg-slate-700 mt-2"></div>
            </div>

            {/* Info Column */}
            <div className="flex-1 flex items-center gap-4 w-full">
               <img src={appt.img} alt={appt.pet} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
               <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{appt.pet} <span className="text-sm font-medium text-slate-500">({appt.owner})</span></h3>
                  <div className="flex items-center gap-3 mt-1">
                     <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">{appt.type}</span>
                     <span className={`text-xs font-bold px-2 py-1 rounded-lg border flex items-center gap-1 ${appt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {appt.status === 'Confirmed' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                        {appt.status}
                     </span>
                  </div>
               </div>
            </div>

            {/* Actions Column */}
            <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
               <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Video className="w-5 h-5" />
               </button>
               
               {/* COMPLETE BUTTON (Triggers the Form) */}
               <button 
                 onClick={() => handleOpenCompleteForm(appt)}
                 className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
               >
                  <Stethoscope className="w-4 h-4" /> Complete
               </button>
            </div>

          </div>
        ))}
      </div>

      {/* --- INTEGRATED CONSULTATION FORM --- */}
      <ConsultationForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onComplete={handleCompleteVisit} 
      />

    </div>
  );
};

export default VetSchedule;