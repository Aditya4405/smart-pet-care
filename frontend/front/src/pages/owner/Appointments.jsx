import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Building, Zap, Calendar, X, FileText, CreditCard, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Appointments = () => {
  const navigate = useNavigate();
  
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState(null);

  const fetchAppointments = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!userStr || !token) { navigate('/login'); return; }

      const user = JSON.parse(userStr);
      const response = await fetch(`http://localhost:8082/api/appointments/owner/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.sort((a, b) => b.id - a.id));
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [navigate]);

  // --- NEW: HANDLE PAYMENT ---
  const handlePayment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8082/api/appointments/${id}/pay`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success("Payment successful! Appointment Confirmed.");
        setSelectedAppt(null);
        fetchAppointments(); // Refresh the list
      } else {
        toast.error("Payment failed.");
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  // --- NEW: HANDLE CANCELLATION ---
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8082/api/appointments/${id}/cancel`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: "OWNER" })
      });

      if (response.ok) {
        toast.success("Appointment Cancelled. Refund initiated if applicable.");
        setSelectedAppt(null);
        fetchAppointments(); // Refresh the list
      } else {
        const errText = await response.text();
        toast.error(errText); // Will show the 24-hour warning from backend!
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  // Check if cancellation is allowed (Frontend > 24hr check)
  const isCancellable = (dateStr) => {
    const apptDate = new Date(dateStr);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0,0,0,0);
    return apptDate > tomorrow;
  };

  const renderStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Awaiting Vet</span>;
      case 'ACCEPTED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 animate-pulse">Payment Required</span>;
      case 'SCHEDULED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Confirmed</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Completed</span>;
      case 'CANCELLED':
      case 'CANCELLED_BY_VET':
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const renderType = (type) => {
    if (type === 'video') return <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 capitalize"><Video className="w-4 h-4"/> Video</span>;
    if (type === 'emergency') return <span className="flex items-center gap-1.5 text-sm font-medium text-red-500 capitalize"><Zap className="w-4 h-4"/> Emergency</span>;
    return <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 capitalize"><Building className="w-4 h-4"/> Clinic</span>;
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500 relative">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Appointments</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No appointments yet</h3>
            <p className="text-slate-500 mb-6">You haven't booked any vet visits for your pets.</p>
            <button onClick={() => navigate('/owner/appointments/book')} className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all">
                Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
                  <th className="px-6 py-4 font-semibold">Doctor</th>
                  <th className="px-6 py-4 font-semibold">Pet</th>
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${appt.vet.firstName}+${appt.vet.lastName}&background=10b981&color=fff`} alt="Vet" className="w-10 h-10 rounded-full"/>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">Dr. {appt.vet.firstName} {appt.vet.lastName}</p>
                            <p className="text-xs text-slate-500">{appt.vet.specialization || 'Veterinarian'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><p className="font-semibold text-slate-700 dark:text-slate-300">{appt.pet.name}</p></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-slate-900 dark:text-white font-medium">{appt.appointmentDate}</p>
                      <p className="text-sm text-slate-500">{appt.appointmentTime}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{renderType(appt.visitType)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(appt.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => setSelectedAppt(appt)} className="text-sm font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 hover:underline transition-colors">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- APPOINTMENT DETAILS MODAL --- */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Appointment Details</h3>
                <p className="text-xs text-slate-500 mt-1">ID: #{selectedAppt.id} • {selectedAppt.appointmentDate}</p>
              </div>
              <button onClick={() => setSelectedAppt(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded-full flex items-center justify-center">
                        <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Doctor</p>
                        <p className="font-bold text-slate-900 dark:text-white">Dr. {selectedAppt.vet.lastName}</p>
                    </div>
                 </div>
                 <div className="h-10 w-px bg-slate-200 dark:bg-slate-600"></div>
                 <div className="flex items-center gap-3 pr-4">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider text-right">Patient</p>
                        <p className="font-bold text-slate-900 dark:text-white text-right">{selectedAppt.pet.name}</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                     <p className="text-xs text-slate-500 font-bold mb-1">DATE & TIME</p>
                     <p className="font-bold text-slate-900 dark:text-white">{selectedAppt.appointmentDate}</p>
                     <p className="text-sm text-slate-600 dark:text-slate-400">{selectedAppt.appointmentTime}</p>
                 </div>
                 <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                     <p className="text-xs text-slate-500 font-bold mb-1">STATUS</p>
                     <div className="mt-1">{renderStatusBadge(selectedAppt.status)}</div>
                     <div className="mt-3">{renderType(selectedAppt.visitType)}</div>
                 </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-slate-500" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">Amount</span>
                  </div>
                  <span className="font-bold text-lg text-slate-900 dark:text-white">
                      {selectedAppt.amountPaid === 0 ? <span className="text-emerald-500 text-base">FREE</span> : `₹${selectedAppt.amountPaid}`}
                  </span>
              </div>

              {/* --- ACTION BUTTONS --- */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-3">
                
                {/* 1. PAY NOW BUTTON (If Vet Accepted) */}
                {selectedAppt.status === 'ACCEPTED' && (
                  <button 
                    onClick={() => handlePayment(selectedAppt.id)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30"
                  >
                    Pay ₹{selectedAppt.amountPaid} to Confirm <CreditCard className="w-4 h-4" />
                  </button>
                )}

                {/* 2. WAITING MESSAGE (If Pending) */}
                {selectedAppt.status === 'PENDING' && (
                  <div className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl font-bold flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Waiting for Doctor's Approval...
                  </div>
                )}

                {/* 3. CANCEL BUTTON (If within rules) */}
                {(selectedAppt.status === 'PENDING' || selectedAppt.status === 'SCHEDULED' || selectedAppt.status === 'ACCEPTED') && (
                  <button 
                    onClick={() => handleCancel(selectedAppt.id)}
                    disabled={!isCancellable(selectedAppt.appointmentDate)}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all 
                      ${isCancellable(selectedAppt.appointmentDate) 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'}`
                    }
                  >
                    {isCancellable(selectedAppt.appointmentDate) ? "Cancel Appointment" : "Too late to cancel (< 24h)"}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;