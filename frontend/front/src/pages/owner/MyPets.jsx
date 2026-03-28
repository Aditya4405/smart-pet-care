import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, PawPrint, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API } from '../../config/api';

const API_BASE = API.BASE_API;
const BASE_URL = API.BASE_URL;

const MyPets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchMyPets();
  }, []);

  const fetchMyPets = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!userStr || !token) { 
        navigate('/login'); 
        return; 
      }

      const user = JSON.parse(userStr);
      
      // FIX: Ensure we only get the numeric ID part to avoid "3:1" errors
      const cleanId = String(user.id).split(':')[0];

      // UPDATED URL: Using the cleaned ID
      const response = await fetch(`${API_BASE}/pets/owner/${cleanId}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const formattedPets = data.map(pet => ({
            id: pet.id,
            name: pet.name,
            breed: pet.breed || 'Unknown Breed',
            age: pet.dateOfBirth || 'N/A',
            sex: pet.gender ? (pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)) : 'Unknown',
            status: pet.vaccinated ? 'Healthy' : 'Vaccine Due',
            weight: pet.weight ? `${pet.weight} kg` : '-',
            image: pet.imageUrl 
            ? `${BASE_URL}/uploads/${pet.imageUrl}`
                : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80',
            originalData: pet
        }));
        setPets(formattedPets);
      } else if (response.status === 403) {
          toast.error("Session expired. Please log in again.");
          navigate('/login');
      }
    } catch (error) { 
      console.error("Fetch Error:", error); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleRemovePet = async (petId) => {
    if (!window.confirm("Are you sure you want to remove this pet? Past appointment records will remain safe.")) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/pets/${petId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Pet removed successfully");
        setOpenMenuId(null);
        fetchMyPets(); 
      }
    } catch (e) { 
      toast.error("Error removing pet"); 
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Pets</h1>
        <button 
          onClick={() => navigate('/owner/pets/add')}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" /> Add Pet
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : pets.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 flex flex-col items-center text-center shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <PawPrint className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No pets found</h2>
            <p className="text-slate-500 mb-6">You haven't added any pets to your profile yet.</p>
            <button onClick={() => navigate('/owner/pets/add')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all">
                Add Your First Pet
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all relative">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                  <img src={pet.image} alt={pet.name} className="w-16 h-16 rounded-full object-cover shadow-sm bg-slate-100" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pet.name}</h3>
                    <p className="text-sm text-slate-500 capitalize">{pet.breed}</p>
                  </div>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === pet.id ? null : pet.id)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {openMenuId === pet.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 py-1 animate-in zoom-in-95 duration-100">
                       <button 
                        onClick={() => handleRemovePet(pet.id)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold"
                       >
                         <Trash2 size={14} /> Remove Pet
                       </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">DOB</p>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">{pet.age}</p>
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Sex</p>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">{pet.sex}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  pet.status === 'Healthy' 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {pet.status}
                </span>
                
                <button 
                  onClick={() => navigate('/owner/health', { state: { pet: pet.originalData } })}
                  className="text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  View Profile →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPets;