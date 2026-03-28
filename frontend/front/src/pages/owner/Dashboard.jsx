import React, { useState, useEffect } from 'react';
import { 
  Calendar, Bell, Activity, ArrowRight, Heart, ShoppingBag, Clock, Video 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JoinMeetingButton from '../shared/JoinMeetingButton';
import { API } from '../../config/api';

const API_BASE = API.BASE_API;

const Dashboard = () => {
  const navigate = useNavigate();
  
  // --- REAL DATA STATE ---
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { firstName: 'Owner' });
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Clean the ID to prevent the 4:1 fetch error
  const cleanId = user.id ? String(user.id).split(':')[0] : null;

  // --- DYNAMIC GREETING LOGIC ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
    if (hour < 21) return { text: 'Good Evening', emoji: '🌅' };
    return { text: 'Good Night', emoji: '🌙' };
  };
  const greeting = getGreeting();

  // --- FETCH FROM SPRING BOOT ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!cleanId || !token) {
          setIsLoading(false);
          return;
        }

        const [petsRes, apptsRes] = await Promise.all([
          fetch(`${API_BASE}/pets/owner/${cleanId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_BASE}/appointments/owner/${cleanId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (petsRes.ok) {
            const petsData = await petsRes.json();
            setPets(petsData);
        }
        if (apptsRes.ok) {
            const apptsData = await apptsRes.json();
            const sortedAppts = apptsData.sort((a, b) => b.id - a.id);
            setAppointments(sortedAppts);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [cleanId]);

  // --- ONLY SHOW TRULY UPCOMING (TODAY OR FUTURE) ---
  const upcomingAppt = appointments.find(appt => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const apptDate = new Date(appt.appointmentDate);
    apptDate.setHours(0, 0, 0, 0);

    return (appt.status === 'SCHEDULED' || appt.status === 'ACCEPTED') && apptDate >= today;
  }) || null;
  
  // --- EXTRACT FOLLOW-UPS ---
  const eligibleFollowUps = appointments.filter(appt => appt.status === 'COMPLETED' && appt.followUpEnabled);

  // ✅ SMART ACTION LOGIC: Only show actions if there's an appointment waiting for payment
  const pendingPaymentsCount = appointments.filter(appt => appt.status === 'ACCEPTED').length;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {greeting.text}, {user.firstName}! {greeting.emoji}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is what's happening with your furry friends today.</p>
        </div>
        <button 
          onClick={() => navigate('/owner/appointments/book')}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
        >
          + Book Appointment
        </button>
      </div>

      {/* 2. Overview Grid (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI 1: Next Appointment */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group min-h-[180px]">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                {upcomingAppt && (
                    <span className={`text-xs font-bold px-2 py-1 rounded text-white uppercase tracking-widest ${upcomingAppt.status === 'ACCEPTED' ? 'bg-amber-500/80 animate-pulse' : 'bg-white/20'}`}>
                        {upcomingAppt.status === 'ACCEPTED' ? 'Action Needed' : 'Upcoming'}
                    </span>
                )}
              </div>
              
              {upcomingAppt ? (
                  <>
                      <h3 className="text-2xl font-bold truncate">Dr. {upcomingAppt.vet?.lastName || 'Vet'}</h3>
                      <p className="text-indigo-100 mt-1 capitalize text-sm flex items-center gap-2">
                          {upcomingAppt.visitType === 'video' ? <Video size={14}/> : <Activity size={14}/>}
                          {upcomingAppt.visitType === 'video' ? 'Video Consult' : 'Clinic Visit'} for {upcomingAppt.pet?.name || 'Pet'}
                      </p>
                  </>
              ) : (
                  <>
                      <h3 className="text-2xl font-bold mt-2">No Upcoming Visits</h3>
                      <p className="text-indigo-100 mt-1">Your pets are all caught up!</p>
                  </>
              )}
            </div>

            {upcomingAppt && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs font-medium text-indigo-100">
                   {upcomingAppt.appointmentTime} • {upcomingAppt.appointmentDate}
                </div>
              </div>
            )}

            {/* --- ACTION BUTTONS (SMART BUTTONS) --- */}
            {upcomingAppt && (
              <div className="mt-4">
                {upcomingAppt.status === 'ACCEPTED' ? (
                  <button 
                    onClick={() => navigate('/owner/appointments')}
                    className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
                  >
                    {upcomingAppt.visitType === 'video' ? 'Pay Now to Unlock Meet Link' : 'Pay Now to Confirm Visit'}
                  </button>
                ) : upcomingAppt.visitType === 'video' && upcomingAppt.status === 'SCHEDULED' ? (
                  <JoinMeetingButton 
                    appointmentDate={upcomingAppt.appointmentDate}
                    appointmentTime={upcomingAppt.appointmentTime}
                    meetLink={upcomingAppt.meetLink}
                  />
                ) : null}
              </div>
            )}
            
          </div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
        </div>

        {/* ✅ KPI 2: FIXED Health Alerts (Smart Action Required) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${pendingPaymentsCount > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
              <Bell className={`w-6 h-6 ${pendingPaymentsCount > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {isLoading ? '-' : pendingPaymentsCount}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">Action Required</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
              {pendingPaymentsCount > 0 
                  ? `You have ${pendingPaymentsCount} pending payment${pendingPaymentsCount > 1 ? 's' : ''}.` 
                  : "No pending actions required."}
          </p>
          <button 
            onClick={() => navigate(pendingPaymentsCount > 0 ? '/owner/appointments' : '/owner/pets')} 
            className={`text-sm font-semibold flex items-center gap-1 transition-colors ${pendingPaymentsCount > 0 ? 'text-amber-600 hover:text-amber-700 dark:text-amber-400' : 'text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400'}`}
          >
            {pendingPaymentsCount > 0 ? 'Complete Payment' : 'View Health Records'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* KPI 3: Active Pets */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <Heart className="w-6 h-6 text-pink-500" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {isLoading ? '-' : pets.length}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">Your Pets</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
              {pets.length > 0 ? `You have ${pets.length} registered pet${pets.length > 1 ? 's' : ''}.` : 'No pets added yet.'}
          </p>
          <button onClick={() => navigate('/owner/pets')} className="text-sm font-medium text-cyan-600 hover:text-cyan-700">View All Pets →</button>
        </div>
      </div>

      {/* --- 3. DYNAMIC ELIGIBLE FREE FOLLOW-UPS --- */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" /> Eligible Free Follow-Ups
             </h2>
             <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                Save on Fees
             </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {eligibleFollowUps.length > 0 ? (
               eligibleFollowUps.map(appt => (
                  <RealFollowUpCard key={appt.id} appt={appt} navigate={navigate} />
               ))
           ) : (
               <p className="text-slate-500 text-sm">You have no pending free follow-ups available.</p>
           )}
        </div>
      </div>

      {/* 4. Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-500" /> Recent Activity
              </h3>
            </div>
            
            <div className="flex flex-col">
                {isLoading ? (
                    <p className="p-6 text-center text-slate-500 text-sm">Loading activity...</p>
                ) : appointments.length > 0 ? (
                    appointments.slice(0, 3).map((appt) => (
                      <div key={appt.id} className="p-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-2xl">
                          {appt.status === 'COMPLETED' ? '✅' : '📅'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {appt.status === 'COMPLETED' ? 'Visit Completed' : 'Appointment Booked'}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {appt.status === 'COMPLETED' ? 'Consultation' : 'Booked a consult'} for {appt.pet?.name} with Dr. {appt.vet?.lastName}.
                          </p>
                        </div>
                        <span className="text-xs font-medium text-slate-400 text-right">
                            {appt.appointmentDate}
                        </span>
                      </div>
                    ))
                ) : (
                    <p className="p-6 text-center text-slate-500 text-sm">No recent activity. Book an appointment to get started!</p>
                )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-md">
              <div className="flex items-center gap-2 mb-4 text-cyan-400">
                <ShoppingBag className="w-5 h-5" />
                <span className="text-xs font-bold tracking-widest uppercase">Pet Marketplace</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Treat your pets to the best.</h3>
              <p className="text-slate-300 mb-6">Get 20% off on your first order.</p>
              <button onClick={() => navigate('/owner/marketplace')} className="bg-white text-slate-900 px-6 py-2 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                Shop Now
              </button>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-cyan-500/20 to-transparent"></div>
          </div>
        </div>

        <div className="space-y-6">
            <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl p-5 border border-cyan-100 dark:border-cyan-800/30">
            <h3 className="font-bold text-cyan-900 dark:text-cyan-100 mb-2">Did you know?</h3>
            <p className="text-sm text-cyan-800 dark:text-cyan-200 leading-relaxed">
              Cats need high-protein diets because they are obligate carnivores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DYNAMIC FOLLOW-UP CARD COMPONENT ---
const RealFollowUpCard = ({ appt, navigate }) => {
    const visitDate = new Date(appt.appointmentDate);
    const expiryDate = new Date(visitDate);
    expiryDate.setDate(expiryDate.getDate() + (appt.followUpDays || 3));
    
    const today = new Date();
    today.setHours(0,0,0,0);
    expiryDate.setHours(0,0,0,0);
    
    const isExpired = today > expiryDate;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Dr. {appt.vet.lastName}</h3>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                        isExpired 
                        ? 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                    }`}>
                        {isExpired ? 'Expired' : `Valid until ${expiryDate.toLocaleDateString()}`}
                    </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{appt.vet.specialization || 'Veterinarian'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Pet: <span className="text-slate-900 dark:text-white font-medium">{appt.pet.name}</span></p>
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Consultation Fee</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {isExpired ? `₹${appt.amountPaid || 500}` : <span className="text-emerald-500 line-through decoration-slate-400 mr-1 opacity-60">₹{appt.amountPaid || 500}</span>}
                        {!isExpired && <span className="text-emerald-500">FREE</span>}
                    </p>
                </div>
                
                <button 
                    onClick={() => {
                        navigate('/owner/appointments/book', { 
                            state: { 
                                preSelectedDoctor: appt.vet, 
                                isFreeFollowUp: !isExpired 
                            } 
                        });
                    }}
                    className={`px-4 py-2 text-sm font-bold rounded-xl transition-all shadow-sm ${
                        isExpired 
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/30'
                    }`}
                >
                    {isExpired ? 'Book Regular' : 'Book Free'}
                </button>
            </div>
        </div>
    );
}

export default Dashboard;