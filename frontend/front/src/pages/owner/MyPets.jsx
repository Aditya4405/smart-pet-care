import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyPets = () => {
  const navigate = useNavigate();

  // Mock data representing the UI you showed
  const pets = [
    { 
      id: 1, 
      name: 'Bella', 
      breed: 'Golden Retriever', 
      age: '3 Yrs', 
      sex: 'Female', 
      status: 'Healthy', 
      weight: '28 kg',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80' 
    },
    { 
      id: 2, 
      name: 'Luna', 
      breed: 'Siamese', 
      age: '2 Yrs', 
      sex: 'Female', 
      status: 'Vaccine Due', 
      weight: '4.5 kg',
      image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=300&q=80' 
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Pets</h1>
        <button 
          onClick={() => navigate('/owner/pets/add')}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" /> Add Pet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <div key={pet.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <img src={pet.image} alt={pet.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pet.name}</h3>
                  <p className="text-sm text-slate-500">{pet.breed}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Age</p>
                <p className="font-bold text-slate-900 dark:text-white">{pet.age}</p>
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Sex</p>
                <p className="font-bold text-slate-900 dark:text-white">{pet.sex}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                pet.status === 'Healthy' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {pet.status}
              </span>
              
              <button 
                // Navigate to HealthRecords and pass the pet data
                onClick={() => navigate('/owner/health', { state: { pet } })}
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                View Profile →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPets;