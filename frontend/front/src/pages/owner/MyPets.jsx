import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';

const MyPets = () => {
  const pets = [
    { name: 'Bella', type: 'Dog', breed: 'Golden Retriever', age: '3 Yrs', status: 'Healthy', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80' },
    { name: 'Luna', type: 'Cat', breed: 'Siamese', age: '2 Yrs', status: 'Vaccine Due', img: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=150&q=80' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Pets</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add New Pet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pets.map((pet, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <img src={pet.img} alt={pet.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{pet.name}</h3>
                  <p className="text-sm text-gray-500">{pet.breed}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
               <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <span className="block text-gray-400 text-xs uppercase">Age</span>
                  <span className="font-semibold text-gray-700">{pet.age}</span>
               </div>
               <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <span className="block text-gray-400 text-xs uppercase">Sex</span>
                  <span className="font-semibold text-gray-700">Female</span>
               </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
               <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                 pet.status === 'Healthy' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
               }`}>
                 {pet.status}
               </span>
               <button className="text-sm font-medium text-cyan-600 hover:text-cyan-700">View Profile →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPets;