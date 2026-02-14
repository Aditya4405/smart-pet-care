import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [pendingVets, setPendingVets] = useState([]);
  const navigate = useNavigate();

  // 1. Fetch Pending Vets on Load
  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVets = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/users/pending-vets');
      if (response.ok) {
        const data = await response.json();
        setPendingVets(data);
      }
    } catch (error) {
      console.error("Error fetching vets:", error);
    }
  };

  // 2. Handle Approval / Rejection
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8082/api/users/${id}/status?status=${newStatus}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        alert(`Doctor ${newStatus} Successfully!`);
        fetchVets(); // Refresh the list
      }
    } catch (error) {
      alert("Action Failed");
    }
  };

  // 3. Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Admin Navbar */}
      <nav className="bg-slate-900 text-white p-4 shadow-lg flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          🛡️ Admin Portal
        </h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-bold">Logout</button>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🔔 Pending Doctor Approvals</h2>

        {pendingVets.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow text-center text-gray-500">
            <p className="text-lg">No pending registrations. All caught up! 🎉</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingVets.map((vet) => (
              <div key={vet.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-400 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                {/* Doctor Details */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{vet.firstName} {vet.lastName}</h3>
                  <p className="text-gray-600 text-sm mb-1">📧 {vet.email} | 📞 {vet.phone}</p>
                  <div className="flex gap-3 text-sm mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">🏥 {vet.clinicName}</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">🎓 {vet.specialization} ({vet.yearsExperience} yrs)</span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">🆔 {vet.licenseNumber}</span>
                  </div>
                  
                  {/* File Link */}
                  {vet.certificateUrl && (
                    <a 
                      href={`http://localhost:8082/uploads/${vet.certificateUrl}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-block mt-3 text-cyan-600 hover:underline text-sm font-semibold"
                    >
                      📄 View Certificate
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleStatusUpdate(vet.id, 'REJECTED')}
                    className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg font-semibold transition"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(vet.id, 'APPROVED')}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg shadow-green-200 transition"
                  >
                    Approve Request
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;