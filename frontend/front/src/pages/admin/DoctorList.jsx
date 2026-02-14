import React, { useEffect, useState } from 'react';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get Auth Header
  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return 'Basic ' + btoa(user.email + ":" + user.password);
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/users/pending-vets', {
         headers: { 'Authorization': getAuthHeader() }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    if(!window.confirm(`Are you sure you want to ${status} this doctor?`)) return;

    try {
      const response = await fetch(`http://localhost:8082/api/users/${id}/status?status=${status}`, {
        method: 'PUT',
        headers: { 'Authorization': getAuthHeader() }
      });
      if (response.ok) {
        alert(`Doctor ${status} successfully!`);
        fetchDoctors(); // Refresh list
      }
    } catch (error) {
      alert("Action failed.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Doctor Approvals</h1>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading requests...</div>
      ) : doctors.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✓</div>
            <h3 className="text-xl font-bold text-slate-800">All Caught Up!</h3>
            <p className="text-gray-500 mt-2">There are no pending doctor registration requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-all">
                
                {/* Doctor Info */}
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold text-2xl border-4 border-white shadow-sm">
                        {doc.firstName[0]}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{doc.firstName} {doc.lastName}</h3>
                        <p className="text-sm text-gray-500">{doc.email} • {doc.phone}</p>
                        <div className="flex gap-2 mt-3">
                            <span className="px-2 py-1 rounded text-xs font-bold bg-blue-50 text-blue-700">{doc.clinicName}</span>
                            <span className="px-2 py-1 rounded text-xs font-bold bg-purple-50 text-purple-700">{doc.specialization}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    {doc.certificateUrl && (
                        <a href={`http://localhost:8082/uploads/${doc.certificateUrl}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-cyan-600 hover:underline flex items-center gap-1">
                            📄 View Certificate
                        </a>
                    )}
                    <div className="flex gap-3">
                        <button onClick={() => handleStatusUpdate(doc.id, 'REJECTED')} className="px-4 py-2 text-red-500 font-bold text-sm bg-red-50 hover:bg-red-100 rounded-lg transition">Reject</button>
                        <button onClick={() => handleStatusUpdate(doc.id, 'APPROVED')} className="px-6 py-2 text-white font-bold text-sm bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-lg shadow-emerald-500/30 transition">Approve</button>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;