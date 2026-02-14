import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const PetCard = ({ name, type, breed, age, image, status }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
          <div>
            <h3 className="font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{breed} • {age} yrs</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          status === 'Healthy' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {status}
        </span>
        <button className="text-sm font-medium text-cyan-600 hover:text-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity">
          View Profile →
        </button>
      </div>
    </div>
  );
};

export default PetCard;