import React, { useState } from 'react';
import { 
  Search, MapPin, Star, Calendar, Stethoscope, 
  Clock, ShieldCheck, Filter 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FindVet = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock Data (In a real app, this comes from an API)
  const doctors = [
    { 
      id: 1, 
      name: "Dr. Sarah Wilson", 
      specialty: "Dermatology", 
      clinic: "Happy Paws Clinic", 
      exp: "8 Years", 
      rating: 4.9, 
      reviews: 124, 
      location: "Lucknow, India", 
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
      available: true 
    },
    { 
      id: 2, 
      name: "Dr. James Carter", 
      specialty: "Surgery", 
      clinic: "City Vet Hospital", 
      exp: "12 Years", 
      rating: 4.8, 
      reviews: 98, 
      location: "Delhi, India", 
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80",
      available: false 
    },
    { 
      id: 3, 
      name: "Dr. Emily Chen", 
      specialty: "General", 
      clinic: "PetCare Center", 
      exp: "5 Years", 
      rating: 4.7, 
      reviews: 215, 
      location: "Mumbai, India", 
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80",
      available: true 
    },
    { 
      id: 4, 
      name: "Dr. Michael Ross", 
      specialty: "Dentistry", 
      clinic: "Smile Pets", 
      exp: "15 Years", 
      rating: 5.0, 
      reviews: 89, 
      location: "Bangalore, India", 
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
      available: true 
    },
  ];

  const categories = ['All', 'General', 'Surgery', 'Dermatology', 'Dentistry'];

  // Filter Logic
  const filteredDoctors = doctors.filter(doc => 
    (selectedCategory === 'All' || doc.specialty === selectedCategory) &&
    (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.clinic.toLowerCase().includes(searchTerm.toLowerCase()))
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
             placeholder="Search doctor, clinic, or specialty..." 
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
            <div key={doc.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col">
                
                {/* Top Section: Image & Info */}
                <div className="flex gap-4">
                    <div className="relative w-20 h-20 shrink-0">
                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover rounded-2xl shadow-sm" />
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
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{doc.location}</p>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                    <button 
                        onClick={() => navigate('/owner/appointments/book', { 
                            state: { preSelectedDoctor: doc }  // <--- KEY FIX: Passing the doctor object
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

    </div>
  );
};

export default FindVet;