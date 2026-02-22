import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  Activity, Syringe, FileText, Edit, Calendar, 
  CheckCircle, AlertTriangle, X, Save, Clock, Camera 
} from 'lucide-react';
import toast from 'react-hot-toast';

const HealthRecords = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // If you navigate via /owner/pets/:id
  const fileInputRef = useRef(null);
  
  const [pet, setPet] = useState(location.state?.pet || null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Mock Vaccination Schedule (Keep this mock for now unless you have a table for it)
  const vaccinations = [
    { id: 1, name: 'Rabies', date: '2023-10-15', status: 'Completed', nextDue: '2024-10-15' },
    { id: 2, name: 'Parvovirus', date: '2023-05-10', status: 'Completed', nextDue: '2024-05-10' },
    { id: 3, name: 'Bordetella', date: null, status: 'Due Now', nextDue: 'Immediate' },
  ];

  // --- FETCH REAL PET & MEDICAL HISTORY ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (!token || !userStr) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);
        const petIdToFetch = id || pet?.id;

        if (!petIdToFetch) {
            toast.error("No pet selected.");
            navigate('/owner/pets');
            return;
        }

        // 1. Fetch Pet Details (to get latest weight, age, etc.)
        const petRes = await fetch(`http://localhost:8082/api/pets/${petIdToFetch}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (petRes.ok) {
            const petData = await petRes.json();
            // Format image
            petData.image = petData.imageUrl 
                ? `http://localhost:8082/uploads/${petData.imageUrl}` 
                : 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80';
            
            // Format mock fields if empty
            petData.age = petData.age || 'Unknown';
            petData.weight = petData.weight ? `${petData.weight} kg` : 'Unknown';
            petData.sex = petData.gender || 'Unknown';

            setPet(petData);
            setEditForm(petData);
        }

        // 2. Fetch Owner's Appointments to build Medical History
        const apptsRes = await fetch(`http://localhost:8082/api/appointments/owner/${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (apptsRes.ok) {
            const apptsData = await apptsRes.json();
            
            // Filter appointments for THIS specific pet
            const thisPetsAppts = apptsData.filter(a => a.pet.id === parseInt(petIdToFetch));
            
            // Sort newest first
            thisPetsAppts.sort((a, b) => b.id - a.id);
            setMedicalHistory(thisPetsAppts);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load records.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]); // Removed 'pet' from dependency to avoid infinite loop

  // Handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); 
      setPet({ ...pet, image: imageUrl });
      setEditForm({ ...editForm, image: imageUrl });
      // TODO: Wire up actual PUT request for image later
      toast.success("Image updated locally. Remember to save.");
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    // Optimistic Update
    setPet(editForm);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
    
    // TODO: Send PUT request to backend to save edits
  };

  if (isLoading || !pet) {
      return (
          <div className="flex justify-center items-center h-[60vh]">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  // Find most recent visit for the stat block
  const lastVisit = medicalHistory.length > 0 ? medicalHistory[0].appointmentDate : 'No visits yet';

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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">{pet.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium capitalize">{pet.breed || pet.species} • {pet.sex}</p>
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
            <p className="text-lg font-bold text-slate-900 dark:text-white text-sm mt-1">{lastVisit}</p>
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
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 min-h-[400px]">
             <div className="flex justify-between items-center mb-8">
               <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-emerald-500" /> Medical History
               </h3>
               {medicalHistory.length > 0 && (
                   <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Download All</button>
               )}
             </div>

             {/* TIMELINE */}
             <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-slate-200 before:to-transparent dark:before:via-slate-700">
                
                {medicalHistory.length === 0 ? (
                    <div className="text-center py-10 relative z-10 bg-white dark:bg-slate-800">
                        <p className="text-slate-500">No medical history available for this pet.</p>
                    </div>
                ) : (
                    medicalHistory.map((record) => (
                      <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        
                        {/* Timeline Dot */}
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${record.status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                            {record.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                        </div>

                        {/* Content Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{record.visitType}</span>
                              <span className="text-xs font-bold text-slate-400">{record.appointmentDate}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">
                                Dr. {record.vet.lastName}
                            </h4>
                            
                            {/* Dynamically show either the vet's clinical notes, or the owner's symptoms */}
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 whitespace-pre-wrap">
                                {record.clinicalNotes 
                                    ? record.clinicalNotes 
                                    : (record.symptoms && record.symptoms !== "No symptoms provided" 
                                        ? `Reason: ${record.symptoms}` 
                                        : "Routine checkup.")}
                            </p>
                            
                            {/* Document Download Link */}
                            {record.medicalReportUrl && (
                              <a 
                                href={`http://localhost:8082/uploads/${record.medicalReportUrl}`}
                                target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors w-max"
                              >
                                  <FileText className="w-4 h-4" /> View Report
                              </a>
                            )}

                            {record.status === 'SCHEDULED' && (
                                <span className="inline-block mt-2 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold uppercase">
                                    Upcoming
                                </span>
                            )}
                        </div>
                      </div>
                    ))
                )}
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
                 <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                 <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95">
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