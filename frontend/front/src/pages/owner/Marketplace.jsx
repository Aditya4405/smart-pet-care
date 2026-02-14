import React from 'react';

const Marketplace = () => {
  return (
    <div>
       <h1 className="text-2xl font-bold text-gray-900 mb-6">Pet Essentials</h1>
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[1, 2, 3, 4].map((item) => (
           <div key={item} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
             <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400">
               Product Image
             </div>
             <div className="p-4">
               <h3 className="font-bold text-gray-900">Premium Dog Food</h3>
               <p className="text-sm text-gray-500 mb-3">10kg Pack • Chicken Flavor</p>
               <div className="flex justify-between items-center">
                 <span className="font-bold text-lg text-emerald-600">$45.00</span>
                 <button className="px-3 py-1.5 bg-cyan-600 text-white text-xs font-bold rounded-lg hover:bg-cyan-700">Add to Cart</button>
               </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};

export default Marketplace;