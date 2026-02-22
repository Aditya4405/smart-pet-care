import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Star, Calendar, Stethoscope, 
  Clock, ShieldCheck, Filter 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FindVet = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'General', 'Surgery', 'Dermatology', 'Dentistry'];

  useEffect(() => {
    fetchApprovedVets();
  }, []);

  const fetchApprovedVets = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8082/api/users/approved-vets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Map backend User data to match the UI Doctor Card format
        const formattedDoctors = data.map(vet => ({
            id: vet.id,
            name: `Dr. ${vet.firstName} ${vet.lastName}`,
            specialty: vet.specialization || 'General',
            clinic: vet.clinicName || 'Independent Practice',
            exp: vet.yearsExperience ? `${vet.yearsExperience} Years` : 'New',
            rating: 4.8, 
            reviews: Math.floor(Math.random() * 50) + 10, 
            
            // --- NOW USING REAL LOCATION DATA ---
            location: vet.location || "Location not provided", 
            
            // Generates a nice avatar using their initials
            image: `https://ui-avatars.com/api/?name=${vet.firstName}+${vet.lastName}&background=10b981&color=fff&size=256`,
            available: true,
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

  // Filter Logic: Now includes searching by location!
  const filteredDoctors = doctors.filter(doc => 
    (selectedCategory === 'All' || doc.specialty.toLowerCase() === selectedCategory.toLowerCase()) &&
    (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     doc.clinic.toLowerCase().includes(searchTerm.toLowerCase()) || 
     doc.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <button className="hidden md:flex items-center gap-2 text-emerald-600 font-bold hover:bg-emerald-50 px-4 py-2 rounded-xl transition-colors">
            <MapPin className="w-4 h-4" /> View Map
        </button>
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
              <div key={doc.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col">
                  
                  {/* Top Section: Image & Info */}
                  <div className="flex gap-4">
                      <div className="relative w-20 h-20 shrink-0">
                          <img src={doc.image} alt={doc.name} className="w-full h-full object-cover rounded-2xl shadow-sm bg-emerald-50" />
                          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-1 rounded-full">
                              <ShieldCheck className="w-5 h-5 text-blue-500 fill-blue-50" />
                          </div>
                      </div>
                      <div>
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
                  <div className="grid grid-cols-2 gap-3 mt-6 mb-6">
                      <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                          <p className="text-xs text-slate-400 font-bold uppercase">Experience</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{doc.exp}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
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
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-lg' 
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                          }`}
                      >
                          {doc.available ? (
                              <>Book Appointment <Calendar className="w-4 h-4" /></>
                          ) : (
                              <>Not Available Today <Clock className="w-4 h-4" /></>
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

    </div>
  );
};

export default FindVet;