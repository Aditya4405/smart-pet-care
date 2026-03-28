import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Star, Calendar, Stethoscope, 
  Clock, ShieldCheck, Filter, Flag, X, AlertTriangle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API } from '../../config/api';

const API_BASE = API.BASE_API;

const FindVet = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- MODERATION MODAL STATE ---
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [doctorToReport, setDoctorToReport] = useState(null);
  const [isReporting, setIsReporting] = useState(false);
  const [reportData, setReportData] = useState({
      reason: '',
      severity: 'MEDIUM'
  });

  const categories = ['All', 'General', 'Surgery', 'Dermatology', 'Dentistry'];

  useEffect(() => {
    fetchApprovedVets();
  }, []);

  const fetchApprovedVets = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE}/users/approved-vets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        const formattedDoctors = data.map(vet => ({
            id: vet.id,
            name: `Dr. ${vet.firstName} ${vet.lastName}`,
            specialty: vet.specialization || 'General',
            clinic: vet.clinicName || 'Independent Practice',
            exp: vet.yearsExperience ? `${vet.yearsExperience} Years` : 'New',
            rating: 4.8, 
            reviews: Math.floor(Math.random() * 50) + 10, 
            location: vet.location || "Location not provided", 
            image: `https://ui-avatars.com/api/?name=${vet.firstName}+${vet.lastName}&background=10b981&color=fff&size=256`,
            // ✅ FIX 1: Properly map the availability status from the backend
            available: vet.isAvailable !== false, 
            originalData: vet
        }));

        setDoctors(formattedDoctors);
      } else {
        toast.error("Failed to load doctors.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- SUBMIT MODERATION REPORT ---
  const handleReportSubmit = async (e) => {
      e.preventDefault();
      if (!reportData.reason.trim()) {
          toast.error("Please provide a reason for the report.");
          return;
      }

      setIsReporting(true);
      try {
          const payload = {
              target: doctorToReport.name,
              reason: reportData.reason,
              severity: reportData.severity
          };

          const response = await fetch(`${API_BASE}/actions/moderation/report`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(payload)
          });

          if (response.ok) {
              toast.success("Report submitted securely to Admin.");
              setReportModalOpen(false);
              setReportData({ reason: '', severity: 'MEDIUM' }); // Reset form
          } else {
              toast.error("Failed to submit report.");
          }
      } catch (error) {
          toast.error("Network error. Please try again.");
      } finally {
          setIsReporting(false);
      }
  };

  const openReportModal = (doc) => {
      setDoctorToReport(doc);
      setReportModalOpen(true);
  };

  // ✅ FIX 2: Added `doc.specialty` to the search conditions!
  const filteredDoctors = doctors.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.specialty.toLowerCase() === selectedCategory.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
        doc.name.toLowerCase().includes(searchLower) || 
        doc.clinic.toLowerCase().includes(searchLower) || 
        doc.location.toLowerCase().includes(searchLower) ||
        doc.specialty.toLowerCase().includes(searchLower); // <-- This makes "vaccination" work!

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Find a Veterinarian</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Book appointments with top-rated doctors near you.
          </p>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
           <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search doctor, clinic, specialty, or location..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all"
           />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
                        selectedCategory === cat 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/30' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* DOCTORS GRID */}
      {isLoading ? (
        <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
              <div key={doc.id} className={`group relative bg-white dark:bg-slate-800 rounded-2xl border p-5 transition-all duration-300 flex flex-col ${doc.available ? 'border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-emerald-500/30' : 'border-slate-200 dark:border-slate-700 opacity-80'}`}>
                  
                  {/* --- OFFLINE BADGE --- */}
                  {!doc.available && (
                      <div className="absolute top-4 left-4 bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider z-10">
                          Currently Offline
                      </div>
                  )}

                  {/* --- REPORT FLAG BUTTON --- */}
                  <button 
                      onClick={() => openReportModal(doc)}
                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                      title="Report Profile"
                  >
                      <Flag className="w-4 h-4" />
                  </button>

                  {/* Top Section: Image & Info */}
                  <div className={`flex gap-4 ${!doc.available ? 'grayscale-[30%]' : ''}`}>
                      <div className="relative w-20 h-20 shrink-0">
                          <img src={doc.image} alt={doc.name} className="w-full h-full object-cover rounded-2xl shadow-sm bg-emerald-50" />
                          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-1 rounded-full">
                              <ShieldCheck className="w-5 h-5 text-blue-500 fill-blue-50" />
                          </div>
                      </div>
                      <div className="pr-6 pt-1">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{doc.name}</h3>
                          <p className="text-sm text-emerald-600 font-bold mb-1">{doc.specialty} Specialist</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Stethoscope className="w-3 h-3" /> {doc.clinic}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                               <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                               <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{doc.rating}</span>
                               <span className="text-xs text-slate-400">({doc.reviews} reviews)</span>
                          </div>
                      </div>
                  </div>

                  {/* Stats Row */}
                  <div className={`grid grid-cols-2 gap-3 mt-6 mb-6 ${!doc.available ? 'opacity-70' : ''}`}>
                      <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                          <p className="text-xs text-slate-400 font-bold uppercase">Experience</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{doc.exp}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl overflow-hidden">
                          <p className="text-xs text-slate-400 font-bold uppercase">Location</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate" title={doc.location}>{doc.location}</p>
                      </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                      <button 
                          onClick={() => navigate('/owner/appointments/book', { 
                              state: { preSelectedDoctor: doc }  
                          })}
                          disabled={!doc.available}
                          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                              doc.available 
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-lg active:scale-[0.98]' 
                              : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed'
                          }`}
                      >
                          {doc.available ? (
                              <>Book Appointment <Calendar className="w-4 h-4" /></>
                          ) : (
                              <>Not Available <Clock className="w-4 h-4" /></>
                          )}
                      </button>
                  </div>

              </div>
          ))}

          {filteredDoctors.length === 0 && (
              <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">No doctors found</h3>
                  <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
              </div>
          )}
        </div>
      )}

      {/* --- MODERATION REPORT MODAL --- */}
      {reportModalOpen && doctorToReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 relative animate-in zoom-in-95 duration-200">
                  <button onClick={() => setReportModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                      <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Report Profile</h2>
                          <p className="text-sm text-slate-500">Flagging {doctorToReport.name}</p>
                      </div>
                  </div>

                  <form onSubmit={handleReportSubmit} className="space-y-5">
                      <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Severity Level</label>
                          <select 
                              value={reportData.severity}
                              onChange={(e) => setReportData({...reportData, severity: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 cursor-pointer"
                          >
                              <option value="LOW">Low (Minor policy violation)</option>
                              <option value="MEDIUM">Medium (Suspicious behavior/Spam)</option>
                              <option value="HIGH">High (Scam, Harmful, or Illegal)</option>
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Reason for Report</label>
                          <textarea 
                              required
                              rows="4"
                              placeholder="Please describe why you are reporting this profile. Our Trust & Safety team will review this."
                              value={reportData.reason}
                              onChange={(e) => setReportData({...reportData, reason: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                          />
                      </div>

                      <div className="flex gap-3 pt-4">
                          <button type="button" onClick={() => setReportModalOpen(false)} className="flex-1 py-3 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                              Cancel
                          </button>
                          <button type="submit" disabled={isReporting} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-70">
                              {isReporting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Submit Report"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default FindVet;