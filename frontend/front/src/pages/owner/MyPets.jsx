import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import hook
import { Plus, MoreHorizontal } from 'lucide-react';

const MyPets = () => {
  const navigate = useNavigate(); // 2. Initialize hook

  const pets = [
    { name: 'Bella', type: 'Dog', breed: 'Golden Retriever', age: '3 Yrs', status: 'Healthy', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80' },
    { name: 'Luna', type: 'Cat', breed: 'Siamese', age: '2 Yrs', status: 'Vaccine Due', img: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=150&q=80' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Pets</h1>
        
        {/* 3. Connected Button */}
        <button 
          onClick={() => navigate('/owner/pets/add')} 
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add New Pet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pets.map((pet, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <img src={pet.img} alt={pet.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{pet.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{pet.breed}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
               <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl text-center">
                  <span className="block text-gray-400 text-xs uppercase font-bold tracking-wider">Age</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{pet.age}</span>
               </div>
               <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl text-center">
                  <span className="block text-gray-400 text-xs uppercase font-bold tracking-wider">Sex</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">Female</span>
               </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
               <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                 pet.status === 'Healthy' 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' 
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
               }`}>
                 {pet.status}
               </span>
               <button className="text-sm font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline">View Profile →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPets;