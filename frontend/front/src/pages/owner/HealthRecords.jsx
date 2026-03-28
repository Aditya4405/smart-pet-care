import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  Activity, Syringe, FileText, Edit, Calendar, 
  CheckCircle, AlertTriangle, X, Save, Clock, Camera, 
  ChevronDown, Filter, Dog, Cat, PawPrint, History,
  TrendingUp, Scale, Check, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API } from '../../config/api';

const API_BASE = API.BASE_API;
const BASE_URL = API.BASE_URL;

const HealthRecords = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const [pet, setPet] = useState(location.state?.pet || null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const filterOptions = [
    { id: 'all', label: 'All Records' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'lastMonth', label: 'Last Month' },
    { id: 'lastYear', label: 'Last Year' }
  ];

  // --- AGE CALCULATION ---
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age <= 0 ? "Juvenile" : `${age} Years`;
  };

  // --- 7-DAY VACCINE REMINDER ---
  const getVaccineStatus = (vaxDate) => {
    if (!vaxDate) return { label: 'Due', color: 'text-amber-500', icon: <Clock size={14}/> };
    const nextDue = new Date(vaxDate);
    nextDue.setFullYear(nextDue.getFullYear() + 1); 
    const today = new Date();
    const diffDays = Math.ceil((nextDue - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Overdue', color: 'text-red-500', icon: <AlertTriangle size={14}/> };
    if (diffDays <= 7) return { label: 'Due Soon', color: 'text-orange-500', icon: <Clock size={14}/> };
    return { label: 'Up to Date', color: 'text-emerald-500', icon: <CheckCircle size={14}/> };
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const petIdToFetch = id || pet?.id;

      // Fetch Pet Data
      const petRes = await fetch(`${API_BASE}/pets/${petIdToFetch}`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });

      if (petRes.ok) {
          const data = await petRes.json();
          // Photo path mapping
          data.displayImage = data.imageUrl 
               ? `${BASE_URL}/uploads/${data.imageUrl}`
              : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300';
          setPet(data);
          setEditForm(data);
      }

      // Fetch Appointments
      const apptsRes = await fetch(`${API_BASE}/appointments/owner/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });

      if (apptsRes.ok) {
          const apptsData = await apptsRes.json();
          const filtered = apptsData.filter(a => a.pet.id === parseInt(petIdToFetch));
          setMedicalHistory(filtered.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)));
      }
    } catch (e) { 
        console.error(e); 
        toast.error("Failed to load data");
    } finally { 
        setIsLoading(false); 
    }
  };

  useEffect(() => { 
    fetchData(); 
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [id]);

  // --- SAVE TO BACKEND LOGIC ---
  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/pets/${pet.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: editForm.name,
          weight: editForm.weight
        })
      });

      if (response.ok) {
        const updatedPet = await response.json();
        updatedPet.displayImage = pet.displayImage; // Keep current image in UI
        setPet(updatedPet);
        setIsEditing(false);
        toast.success("Pet profile updated!");
      } else {
        toast.error("Failed to update database.");
      }
    } catch (error) {
      toast.error("Server connection error.");
    }
  };

  // --- PHOTO UPLOAD LOGIC ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_BASE}/pets/owner/${JSON.parse(localStorage.getItem('user')).id}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        
        if (response.ok) {
          toast.success("Photo uploaded! Please refresh to see changes.");
          fetchData(); 
        }
      } catch (err) {
        toast.error("Image upload failed.");
      }
    }
  };

  const getFilteredHistory = () => {
    const now = new Date();
    return medicalHistory.filter(item => {
      const itemDate = new Date(item.appointmentDate);
      if (filterType === 'thisMonth') return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      if (filterType === 'lastMonth') {
        const lastM = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return itemDate.getMonth() === lastM && itemDate.getFullYear() === year;
      }
      if (filterType === 'lastYear') return itemDate.getFullYear() === now.getFullYear() - 1;
      return true;
    });
  };

  const getStatusIcon = (status) => {
    const s = status?.toUpperCase();
    if (s === 'COMPLETED') return <CheckCircle size={18} className="text-emerald-500" />;
    if (s === 'REJECTED') return <AlertCircle size={18} className="text-rose-500" />;
    return <Clock size={18} className="text-slate-400" />;
  };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    if (s === 'COMPLETED') return 'text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20';
    if (s === 'REJECTED') return 'text-rose-500 bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20';
    return 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-500 dark:bg-amber-500/10 dark:border-amber-500/20';
  };

  if (isLoading || !pet) return (
    <div className="h-screen bg-transparent flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const SpeciesIcon = pet.species?.toUpperCase() === 'DOG' ? Dog : pet.species?.toUpperCase() === 'CAT' ? Cat : PawPrint;

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 space-y-8 font-sans text-slate-900 dark:text-slate-200 animate-in fade-in duration-500">
      
      {/* 1. SAAS PROFILE HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img 
                src={pet.displayImage} 
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-2 border-white dark:border-slate-800 object-cover bg-slate-100 dark:bg-slate-800 shadow-md" 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300' }}
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 rounded-lg text-white shadow border-2 border-white dark:border-slate-900">
                <SpeciesIcon size={16} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight capitalize">{pet.name}</h1>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Edit size={18} />
                </button>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-1 capitalize">
                {pet.breed || 'Unknown'} <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span> {pet.gender}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
            <StatCard label="Age" value={calculateAge(pet.dateOfBirth)} />
            <StatCard label="Weight" value={`${pet.weight || '--'} kg`} />
            <StatCard label="Last Visit" value={medicalHistory[0]?.appointmentDate || 'N/A'} />
            <StatCard label="Status" value="Healthy" color="text-emerald-600 dark:text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SIDEBAR: ALERT & VAX SCHEDULE */}
        <div className="space-y-6">
          
          {/* Actionable Health Alert */}
          <div className="bg-amber-50 dark:bg-[#1f160b] border border-amber-200 dark:border-amber-900/50 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500">
              <AlertTriangle size={20} />
              <h4 className="font-bold tracking-wide uppercase text-sm">Vaccination Due</h4>
            </div>
            <p className="text-sm text-amber-900 dark:text-slate-300 leading-relaxed font-medium">
              Rabies booster is currently overdue. Schedule an appointment to keep {pet.name} safe.
            </p>
            <button 
              onClick={() => navigate('/owner/appointments/book')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-white dark:text-slate-900 font-bold rounded-xl transition-all shadow-lg active:scale-95 text-sm"
            >
              Schedule Visit Now
            </button>
          </div>

          {/* Vaccination Schedule List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Syringe size={18} className="text-emerald-600 dark:text-emerald-500" /> Vaccination Schedule
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {['Rabies', 'Parvovirus', 'Bordetella'].map(type => {
                const status = getVaccineStatus(pet[type.toLowerCase() + 'Date']);
                return (
                  <div key={type} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-200">{type}</p>
                      <p className="text-xs text-slate-500 mt-1">Due: {pet[type.toLowerCase() + 'Date'] || 'Unknown'}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      status.label === 'Up to Date' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20' 
                        : status.label === 'Overdue' 
                          ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20' 
                          : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20'
                    }`}>
                      {status.icon} {status.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MEDICAL HISTORY TIMELINE */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm min-h-[600px]">
             
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-3">
                  <History size={22} className="text-emerald-600 dark:text-emerald-500"/> Medical History
                </h3>
                
                {/* Custom Filter Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                  >
                    <Filter size={14} />
                    {filterOptions.find(o => o.id === filterType).label}
                    <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                      {filterOptions.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => { setFilterType(opt.id); setIsFilterOpen(false); }}
                          className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center justify-between transition-colors ${
                            filterType === opt.id 
                              ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' 
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {opt.label}
                          {filterType === opt.id && <Check size={14} className="text-emerald-600 dark:text-emerald-500" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
             </div>

             {/* TIMELINE */}
             <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                {getFilteredHistory().length === 0 ? (
                    <div className="py-20 flex flex-col items-center text-center relative z-10">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400"><History size={32} /></div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold">No medical records found.</p>
                    </div>
                ) : (
                    getFilteredHistory().map((record) => (
                      <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        
                        {/* Timeline Node Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                            {getStatusIcon(record.status)}
                        </div>

                        {/* Timeline Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
                            <div className="flex justify-between items-start mb-3 gap-2">
                              <div className="flex items-center gap-3">
                                {/* Visit Type Badge */}
                                <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 px-2 py-1 rounded uppercase tracking-wider">
                                  {record.visitType || 'CLINIC'}
                                </span>
                                <h4 className="text-slate-900 dark:text-white font-bold text-base">Dr. {record.vet?.lastName || 'Veterinarian'}</h4>
                              </div>
                              <div className="flex flex-col items-end gap-1.5">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{record.appointmentDate}</span>
                                <span className={`text-[9px] px-2 py-0.5 rounded border font-bold uppercase tracking-widest ${getStatusBadge(record.status)}`}>
                                  {record.status}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                              "{record.clinicalNotes || record.symptoms || 'No symptoms provided'}"
                            </p>
                        </div>
                      </div>
                    ))
                )}
             </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
               <h3 className="font-bold text-lg text-slate-900 dark:text-white">Edit Profile</h3>
               <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-8 space-y-6">
                
                {/* Image Upload Area */}
                <div className="flex justify-center">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    <img src={pet.displayImage} className="w-24 h-24 rounded-3xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-md" />
                    <div className="absolute inset-0 bg-black/60 rounded-3xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white">
                      <Camera size={20}/>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {/* EDITABLE FIELDS */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Pet Name</label>
                    <input 
                      type="text" 
                      value={editForm?.name || ''} 
                      onChange={e => setEditForm({...editForm, name: e.target.value})} 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm" 
                    />
                  </div>

                  {/* READ-ONLY FIELD (Disabled to prevent changes) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Breed</label>
                    <input 
                      type="text" 
                      value={pet.breed || ''} 
                      readOnly
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 p-3 rounded-xl outline-none cursor-not-allowed opacity-70 text-sm" 
                    />
                  </div>
                  
                  {/* READ-ONLY FIELD (Disabled to prevent changes) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                    <select 
                      value={pet.gender || ''} 
                      disabled
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 p-3 rounded-xl outline-none cursor-not-allowed opacity-70 appearance-none text-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  {/* EDITABLE FIELD */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={editForm?.weight || ''} 
                      onChange={e => setEditForm({...editForm, weight: e.target.value})} 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm" 
                    />
                  </div>
                  
                  {/* READ-ONLY FIELD (Disabled to prevent changes) */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                    <input 
                      type="date" 
                      value={pet.dateOfBirth || ''} 
                      readOnly
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 p-3 rounded-xl outline-none cursor-not-allowed opacity-70 text-sm" 
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 mt-4">
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="flex-1 py-3 font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveEdit} 
                    className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                  >
                    <Save size={16}/> Save Changes
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- MINI COMPONENTS --- */
const StatCard = ({ label, value, color = "text-slate-900 dark:text-white" }) => (
  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
    <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider mb-1">{label}</p>
    <p className={`text-lg font-bold ${color}`}>{value}</p>
  </div>
);

export default HealthRecords;