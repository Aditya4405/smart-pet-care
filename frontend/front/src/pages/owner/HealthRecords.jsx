import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, Syringe, FileText, Edit, Calendar, 
  CheckCircle, AlertTriangle, X, Save, Clock, Camera 
} from 'lucide-react';

const HealthRecords = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Get pet from navigation state, or fallback to a default if accessed directly
  const initialPet = location.state?.pet || {
    id: 1, name: 'Bella', breed: 'Golden Retriever', age: '3 Yrs', sex: 'Female', weight: '28 kg',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80'
  };

  const [pet, setPet] = useState(initialPet);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(pet);

  // Mock Vaccination Schedule
  const vaccinations = [
    { id: 1, name: 'Rabies', date: '2023-10-15', status: 'Completed', nextDue: '2024-10-15' },
    { id: 2, name: 'Parvovirus', date: '2023-05-10', status: 'Completed', nextDue: '2024-05-10' },
    { id: 3, name: 'Bordetella', date: null, status: 'Due Now', nextDue: 'Immediate' },
  ];

  // Mock Medical History Timeline
  const medicalHistory = [
    { id: 101, date: '2024-01-20', type: 'Checkup', doctor: 'Dr. Sarah Wilson', notes: 'Routine checkup. Heart and lungs sound perfectly healthy. Recommended slight diet adjustment.', document: 'Checkup_Report.pdf' },
    { id: 102, date: '2023-11-05', type: 'Illness', doctor: 'Dr. James Carter', notes: 'Diagnosed with mild ear infection. Prescribed ear drops for 7 days.', document: 'Prescription_Nov.pdf' },
    { id: 103, date: '2023-10-15', type: 'Vaccination', doctor: 'Dr. Sarah Wilson', notes: 'Administered annual Rabies booster.', document: null },
  ];

  // Handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Local preview
      setPet({ ...pet, image: imageUrl });
      setEditForm({ ...editForm, image: imageUrl });
      // TODO: Upload 'file' to your backend server here
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setPet(editForm);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* 1. HEADER & PET IDENTITY */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        <div className="px-6 sm:px-10 pb-8 relative flex flex-col sm:flex-row items-center sm:items-end gap-6">
          
          {/* EDITABLE PET IMAGE CONTAINER */}
          <div className="relative -mt-16 shrink-0 group">
            <img 
              src={pet.image} 
              alt={pet.name} 
              className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 object-cover shadow-lg bg-white" 
            />
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            {/* Edit Overlay Button */}
            <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer border-4 border-transparent"
            >
              <Camera className="w-8 h-8 text-white/90" />
            </button>
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{pet.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{pet.breed} • {pet.sex}</p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100 dark:divide-slate-700 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="p-4 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase">Age</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{pet.age}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase">Weight</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{pet.weight}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase">Next Vaccine</p>
            <p className="text-lg font-bold text-amber-600">Immediate</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase">Last Visit</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">Jan 20, 2024</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: VACCINATIONS & ALERTS */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Status Alert */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 p-5 rounded-2xl flex items-start gap-3">
             <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
             <div>
                <h4 className="font-bold text-amber-800 dark:text-amber-400">Vaccination Due</h4>
                <p className="text-sm text-amber-700/80 dark:text-amber-500/80 mt-1">Bordetella vaccine is currently overdue. Please schedule an appointment.</p>
                <button onClick={() => navigate('/owner/appointments/book')} className="mt-3 text-sm font-bold text-amber-600 hover:underline">Schedule Now →</button>
             </div>
          </div>

          {/* Vaccination Schedule Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Syringe className="w-5 h-5 text-emerald-500" /> Vaccination Schedule
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
               {vaccinations.map(vax => (
                  <div key={vax.id} className="p-5 flex items-center justify-between">
                     <div>
                        <p className="font-bold text-slate-900 dark:text-white">{vax.name}</p>
                        <p className="text-xs text-slate-500 mt-1">Due: {vax.nextDue}</p>
                     </div>
                     {vax.status === 'Completed' ? (
                        <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                           <CheckCircle className="w-4 h-4" /> Done
                        </div>
                     ) : (
                        <div className="flex items-center gap-1 text-amber-600 text-sm font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                           <Clock className="w-4 h-4" /> Due
                        </div>
                     )}
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MEDICAL HISTORY TIMELINE */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
             <div className="flex justify-between items-center mb-8">
               <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-emerald-500" /> Medical History
               </h3>
               <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Download All</button>
             </div>

             {/* TIMELINE */}
             <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-slate-200 before:to-transparent dark:before:via-slate-700">
                
                {medicalHistory.map((record, index) => (
                   <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      
                      {/* Timeline Dot */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                         <Calendar className="w-4 h-4" />
                      </div>

                      {/* Content Card */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{record.type}</span>
                            <span className="text-xs font-bold text-slate-400">{record.date}</span>
                         </div>
                         <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{record.doctor}</h4>
                         <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{record.notes}</p>
                         
                         {record.document && (
                            <button className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors w-max">
                               <FileText className="w-4 h-4" /> {record.document}
                            </button>
                         )}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* --- EDIT PROFILE MODAL --- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
               <h3 className="font-bold text-lg text-slate-900 dark:text-white">Edit Pet Profile</h3>
               <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">Pet Name</label>
                   <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full mt-1 p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">Breed</label>
                   <input type="text" value={editForm.breed} onChange={e => setEditForm({...editForm, breed: e.target.value})} className="w-full mt-1 p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">Age</label>
                   <input type="text" value={editForm.age} onChange={e => setEditForm({...editForm, age: e.target.value})} className="w-full mt-1 p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">Weight</label>
                   <input type="text" value={editForm.weight} onChange={e => setEditForm({...editForm, weight: e.target.value})} className="w-full mt-1 p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                 </div>
               </div>
               
               <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700 mt-6">
                 <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
                 <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2">
                   <Save className="w-4 h-4"/> Save Changes
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HealthRecords;