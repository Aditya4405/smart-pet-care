import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, FileText, CheckCircle, Stethoscope, Check, X, AlertCircle } from 'lucide-react';
import ConsultationForm from '../../components/vet/ConsultationForm';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import JoinMeetingButton from '../shared/JoinMeetingButton';
import { API } from '../../config/api';

const VetSchedule = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchVetAppointments = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!userStr || !token) {
        navigate('/login');
        return;
      }

      const vetUser = JSON.parse(userStr);

      const response = await fetch(`${API.BASE_API}/appointments/vet/${vetUser.id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const sortedData = data.sort((a, b) => b.id - a.id);
        setAppointments(sortedData);
      } else {
        toast.error("Failed to load your schedule.");
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVetAppointments();
  }, [navigate]);

  const handleVetAction = async (id, action) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API.BASE_API}/appointments/${id}/vet-action`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        toast.success(`Appointment ${action === 'ACCEPT' ? 'Accepted' : 'Rejected'}!`);
        fetchVetAppointments();
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  const handleOpenCompleteForm = (appt) => {
    setSelectedAppointment(appt);
    setIsFormOpen(true);
  };

  // --- UPDATED COMPLETE HANDLER ---
  const handleCompleteVisit = async (data) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API.BASE_API}/appointments/${selectedAppointment.id}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          clinicalNotes: data.notes,              
          followUpEnabled: data.enableFollowUp,   
          followUpDays: data.days || null         
        })
      });

      if (response.ok) {
        const updatedAppt = await response.json(); // Get the backend object with file URL

        setAppointments(prev =>
          prev.map(a =>
            a.id === selectedAppointment.id ? updatedAppt : a
          )
        );

        toast.success(
          data.enableFollowUp
            ? `Visit Completed. Follow-up enabled.`
            : "Visit completed."
        );

        setIsFormOpen(false);
      } else {
        const errorText = await response.text();
        toast.error("Failed to save: " + errorText);
      }
    } catch (error) {
      console.error("Error completing visit:", error);
      toast.error("Network error while trying to complete visit.");
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1 uppercase bg-amber-50 text-amber-600 border-amber-200 animate-pulse"><AlertCircle className="w-3 h-3"/> New Request</span>;
      case 'ACCEPTED':
        return <span className="text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1 uppercase bg-indigo-50 text-indigo-600 border-indigo-200"><Clock className="w-3 h-3"/> Awaiting Payment</span>;
      case 'SCHEDULED':
        return <span className="text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1 uppercase bg-blue-50 text-blue-600 border-blue-200"><Calendar className="w-3 h-3"/> Confirmed</span>;
      case 'COMPLETED':
        return <span className="text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1 uppercase bg-emerald-50 text-emerald-600 border-emerald-200"><CheckCircle className="w-3 h-3"/> Completed</span>;
      case 'REJECTED':
      case 'CANCELLED':
      case 'CANCELLED_BY_VET':
        return <span className="text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1 uppercase bg-red-50 text-red-600 border-red-200"><X className="w-3 h-3"/> Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Schedule</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your appointments and requests.</p>
        </div>
        <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <Calendar className="w-5 h-5 text-slate-500" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your schedule is clear!</h3>
          <p className="text-slate-500">No appointments have been booked with you yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt.id} className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-all ${appt.status === 'PENDING' ? 'border-amber-300 dark:border-amber-700/50 ring-2 ring-amber-500/10' : 'border-slate-200 dark:border-slate-700'}`}>

              <div className="flex flex-col items-center min-w-[90px]">
                <span className="text-xs font-bold text-slate-500 mb-1">{appt.appointmentDate}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{appt.appointmentTime}</span>
                <div className="h-full w-0.5 bg-slate-100 dark:bg-slate-700 mt-2 hidden md:block"></div>
              </div>

              <div className="flex-1 flex items-center gap-4 w-full">
                <img
                  src={appt.pet.imageUrl ? `${API.BASE_URL}/uploads/${appt.pet.imageUrl}` : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80'}
                  alt={appt.pet.name}
                  className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-slate-100"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {appt.pet.name} <span className="text-sm font-medium text-slate-500">({appt.owner.firstName} {appt.owner.lastName})</span>
                  </h3>

                  <p className="text-xs text-slate-500 max-w-md truncate mb-2 mt-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Notes: </span>
                    {appt.symptoms || "Routine Checkup"}
                  </p>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 uppercase">{appt.visitType}</span>
                    {renderStatusBadge(appt.status)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 justify-end">

                {appt.medicalReportUrl && (
                  <a
                    href={`${API.BASE_URL}/uploads/${appt.medicalReportUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-500 hover:text-emerald-600 transition-colors border border-slate-200 dark:border-slate-600"
                  >
                    <FileText className="w-5 h-5" />
                  </a>
                )}

                {appt.visitType === 'video' && appt.status === 'SCHEDULED' && (
                  <div className="w-48 md:w-auto">
                    <JoinMeetingButton
                      appointmentDate={appt.appointmentDate}
                      appointmentTime={appt.appointmentTime}
                      meetLink={appt.meetLink}
                    />
                  </div>
                )}

                {appt.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleVetAction(appt.id, 'REJECT')} className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl border border-red-200 transition-colors">
                      <X className="w-5 h-5" />
                    </button>

                    <button onClick={() => handleVetAction(appt.id, 'ACCEPT')} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95">
                      <Check className="w-4 h-4" /> Accept
                    </button>
                  </div>
                )}

                {appt.status === 'ACCEPTED' && (
                  <p className="text-xs font-bold text-slate-400 italic">Waiting for Client Payment...</p>
                )}

                {appt.status === 'SCHEDULED' && (
                  <button onClick={() => handleOpenCompleteForm(appt)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95">
                    <Stethoscope className="w-4 h-4" /> Complete
                  </button>
                )}

                {/* --- PRESCRIPTION CONTROLS FOR VET --- */}
                {appt.status === 'COMPLETED' && (
                  <div className="flex gap-2">
                    {appt.prescriptionFileUrl && (
                      <>
                        <a
                          href={`${API.BASE_URL}/uploads/${appt.prescriptionFileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
                        >
                          View Doc
                        </a>
                        <a
                          href={`${API.BASE_URL}/uploads/${appt.prescriptionFileUrl}`}
                          download
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
                        >
                          Download
                        </a>
                      </>
                    )}
                    <button
                      onClick={() => handleOpenCompleteForm(appt)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
                    >
                      Edit Notes
                    </button>
                  </div>
                )}

              </div>

            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <ConsultationForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onComplete={handleCompleteVisit}
          initialData={selectedAppointment} // Pass existing data so the vet can edit!
        />
      )}

    </div>
  );
};

export default VetSchedule;