import React, { useState, useEffect } from 'react';
import { API } from "../../config/api";
import { Calendar, Users, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { firstName: 'Vet', lastName: 'Doctor' };
  const cleanId = user.id ? String(user.id).split(':')[0] : null;

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // ✅ NEW: State for the Vet's online/offline availability
  const [isAvailable, setIsAvailable] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
    if (hour < 21) return { text: 'Good Evening', emoji: '🌅' };
    return { text: 'Good Night', emoji: '🌙' };
  };
  const greeting = getGreeting();

  useEffect(() => {
    const fetchVetData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!cleanId || !token) {
            navigate('/login');
            return;
        }

        // Fetch Appointments
        const apptResponse = await fetch(`${API.BASE_API}/appointments/vet/${cleanId}`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });

        if (apptResponse.ok) {
            const data = await apptResponse.json();
            const sortedData = data.sort((a, b) => b.id - a.id);
            setAppointments(sortedData);
        }

        // ✅ NEW: Fetch Vet's current Availability Status
        const userResponse = await fetch(`${API.BASE_API}/users/${cleanId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (userResponse.ok) {
            const userData = await userResponse.json();
            // If it's null in DB, default to true
            setIsAvailable(userData.isAvailable !== false); 
        }

      } catch (error) {
        console.error("Error fetching vet dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVetData();
  }, [cleanId, navigate]);

  // ✅ NEW: Handle flipping the switch to go Offline/Online
  const handleToggleAvailability = async () => {
    setIsToggling(true);
    const newStatus = !isAvailable;
    setIsAvailable(newStatus); // Optimistic UI update

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API.BASE_API}/users/${cleanId}/availability?isAvailable=${newStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success(newStatus ? "You are now ONLINE. Owners can book you." : "You are now OFFLINE. Hidden from search.");
      } else {
        setIsAvailable(!newStatus); // Revert on failure
        toast.error("Failed to update availability status.");
      }
    } catch (err) {
      setIsAvailable(!newStatus);
      toast.error("Network error updating status.");
    } finally {
      setIsToggling(false);
    }
  };

  // --- DYNAMIC CALCULATIONS ---
  const validAppointments = appointments.filter(a => a.status !== 'CANCELLED' && a.status !== 'REJECTED');
  const totalEarnings = validAppointments.reduce((sum, appt) => sum + (appt.amountPaid || 0), 0);
  const uniquePatientsCount = new Set(validAppointments.map(appt => appt.pet?.id)).size;
  const pendingCount = appointments.filter(appt => appt.status === 'SCHEDULED' || appt.status === 'PENDING').length;

  // --- DYNAMIC WEEKLY EARNINGS CALCULATOR ---
  const getWeeklyChartData = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push({
            dateObj: d,
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dateString: d.toISOString().split('T')[0],
            amount: 0
        });
    }

    validAppointments.forEach(appt => {
        if (appt.amountPaid && appt.appointmentDate) {
            const targetDay = days.find(d => d.dateString === appt.appointmentDate);
            if (targetDay) {
                targetDay.amount += appt.amountPaid;
            }
        }
    });

    const maxAmount = Math.max(...days.map(d => d.amount), 1); 

    return days.map(d => ({
        day: d.dayName,
        value: `₹${d.amount}`,
        height: `${Math.max((d.amount / maxAmount) * 100, 5)}%`, 
        highlight: d.dateString === today.toISOString().split('T')[0] 
    }));
  };

  const weeklyData = getWeeklyChartData();

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-500">
      
      {/* 1. Welcome Section & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            {greeting.text}, Dr. {user.lastName || 'Vet'}! {greeting.emoji}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium tracking-wide">
            Overview of your practice today.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          
          {/* ✅ THE AVAILABILITY TOGGLE */}
          <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</p>
              <p className={`text-sm font-bold ${isAvailable ? 'text-emerald-500' : 'text-red-500'}`}>
                {isAvailable ? 'Accepting Patients' : 'Offline / Unavailable'}
              </p>
            </div>
            <button 
              onClick={handleToggleAvailability}
              disabled={isToggling || isLoading}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isAvailable ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <button 
            onClick={() => navigate('/vet/schedule')}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            View Schedule
          </button>
        </div>
      </div>

      {/* 2. KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Appointments Total" value={isLoading ? "-" : appointments.length} trend="Total" icon={Calendar} color="blue" />
        <StatCard title="Total Patients" value={isLoading ? "-" : uniquePatientsCount} trend="Active" icon={Users} color="indigo" />
        <StatCard title="Upcoming Visits" value={isLoading ? "-" : pendingCount} trend="To-Do" icon={Clock} color="amber" />
        <StatCard title="Total Earnings" value={isLoading ? "-" : `₹${totalEarnings}`} trend="Revenue" icon={DollarSign} color="emerald" />
      </div>

      {/* 3. Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Today's Appointments (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-slate-900 dark:text-white text-lg">Recent Bookings</h3>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                  <p className="text-slate-500 text-sm py-4 animate-pulse">Loading schedule...</p>
              ) : appointments.length > 0 ? (
                  appointments.slice(0, 4).map(appt => (
                      <AppointmentRow 
                          key={appt.id}
                          time={appt.appointmentTime} 
                          date={appt.appointmentDate}
                          patient={appt.pet?.name || 'Unknown'} 
                          owner={appt.owner?.firstName || 'Unknown'} 
                          type={appt.visitType} 
                          status={appt.status} 
                      />
                  ))
              ) : (
                  <p className="text-slate-500 text-sm py-4">No appointments booked yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Weekly Earnings Graph (1/3 width) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-full min-h-[300px] flex flex-col">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6">Weekly Earnings</h3>
            <div className="flex items-end justify-between flex-1 gap-2 mt-4 h-48">
               {weeklyData.map((data, idx) => (
                  <Bar key={idx} height={data.height} day={data.day} value={data.value} highlight={data.highlight} />
               ))}
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  };
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}><Icon className="w-5 h-5" /></div>
      </div>
    </div>
  );
};

const AppointmentRow = ({ time, date, patient, owner, type, status }) => {
    const isConfirmed = status === 'SCHEDULED' || status === 'CONFIRMED' || status === 'ACCEPTED';
    const isCompleted = status === 'COMPLETED';
    const isCancelled = status === 'CANCELLED' || status === 'CANCELLED_BY_VET' || status === 'REJECTED';

    return (
      <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-slate-100 dark:border-slate-700/50">
        <div className="flex flex-col items-center justify-center min-w-[70px] h-14 bg-slate-100 dark:bg-slate-700 rounded-xl text-center px-2">
           <span className="text-xs font-bold text-slate-900 dark:text-white">{time?.split(' ')[0] || '-'}</span>
           <span className="text-[10px] text-slate-500 uppercase font-bold">{date?.substring(5) || '-'}</span>
        </div>
        <div className="flex-1">
           <h4 className="font-bold text-slate-900 dark:text-white">{patient} <span className="text-slate-500 font-normal text-sm">({owner})</span></h4>
           <p className="text-xs text-slate-500 font-bold uppercase">{type}</p>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
            isCompleted ? 'bg-blue-100 text-blue-700' : 
            isCancelled ? 'bg-red-100 text-red-700' :
            isConfirmed ? 'bg-emerald-100 text-emerald-700' : 
            'bg-amber-100 text-amber-700'
        }`}>
            {status}
        </span>
      </div>
    );
};

const Bar = ({ height, day, value, highlight }) => (
  <div className="flex flex-col items-center flex-1 gap-2 group cursor-pointer h-full justify-end relative" title={value}>
    <div className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      {value}
    </div>
    <div className="w-full flex justify-center items-end h-full">
       <div style={{ height }} className={`w-full max-w-[30px] rounded-t-md transition-all duration-500 ${highlight ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-emerald-200 dark:bg-emerald-800 group-hover:bg-emerald-400 dark:group-hover:bg-emerald-700'}`} />
    </div>
    <span className={`text-[10px] font-bold ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>{day}</span>
  </div>
);

export default Dashboard;