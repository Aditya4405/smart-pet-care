import React from 'react';
import { Calendar, Bell, Plus } from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard'; // Reuse
import PetCard from '../../components/user/PetCard';

const UserDashboard = () => {
  // Mock Data
  const pets = [
    { name: 'Bella', type: 'Dog', breed: 'Golden Retriever', age: 3, status: 'Healthy', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&h=150&fit=crop' },
    { name: 'Luna', type: 'Cat', breed: 'Siamese', age: 2, status: 'Vaccination Due', image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=150&h=150&fit=crop' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hello, Aditya 👋</h1>
          <p className="text-gray-500">Here's what's happening with your pets today.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Pet
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-cyan-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-cyan-100 text-sm font-medium">Upcoming Appointment</p>
              <h3 className="text-xl font-bold mt-1">Dr. Sarah Smith</h3>
              <p className="text-sm opacity-90 mt-1">Tomorrow, 10:00 AM</p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors">
            Reschedule
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Health Alerts</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">1 Pending</h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Bell className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Luna's Rabies vaccination is due in 3 days.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Pets</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">2</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Heart className="w-6 h-6 text-purple-500" /> {/* Import Heart */}
            </div>
          </div>
           <button className="mt-4 text-sm font-medium text-cyan-600 hover:text-cyan-700">View All Pets →</button>
        </div>
      </div>

      {/* My Pets Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">My Pets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet, idx) => (
            <PetCard key={idx} {...pet} />
          ))}
          {/* Add New Pet Placeholder */}
          <button className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 hover:border-cyan-500 hover:text-cyan-500 hover:bg-cyan-50/50 transition-all group h-full min-h-[140px]">
            <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">Add New Pet</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Need to add Heart icon import at top
import { Heart } from 'lucide-react';

export default UserDashboard;