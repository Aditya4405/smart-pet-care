import React, { useState, useEffect } from 'react';
import { Video, Lock } from 'lucide-react';

const JoinMeetingButton = ({ appointmentDate, appointmentTime, meetLink }) => {
  const [canJoin, setCanJoin] = useState(false);
  const [timeMessage, setTimeMessage] = useState('Checking time...');

  useEffect(() => {
    if (!meetLink) {
      setTimeMessage('No meeting link generated');
      return;
    }

    const checkTime = () => {
      try {
        const now = new Date();
        
        // --- FIXED TIME PARSER ---
        // Convert "02:00 PM" to "14:00"
        const [time, modifier] = appointmentTime.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;

        // Combine date and 24-hour time
        const appointmentDateTime = new Date(`${appointmentDate}T${hours}:${minutes}:00`); 
        
        // Calculate difference in minutes
        const diffInMs = appointmentDateTime - now;
        const diffInMinutes = diffInMs / (1000 * 60);

        if (diffInMinutes > 5) {
          setCanJoin(false);
          setTimeMessage(`Unlocks 5 mins before (${Math.ceil(diffInMinutes)} mins left)`);
        } else if (diffInMinutes <= 5 && diffInMinutes >= -60) {
          // Allows joining up to 60 mins late
          setCanJoin(true);
          setTimeMessage('Meeting is open!');
        } else {
          setCanJoin(false);
          setTimeMessage('Meeting has ended');
        }
      } catch (error) {
        console.error("Error calculating time:", error);
        setTimeMessage('Error calculating time');
      }
    };

    checkTime(); // Run immediately
    const interval = setInterval(checkTime, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [appointmentDate, appointmentTime, meetLink]);

  if (!meetLink) return null;

  return (
    <button 
      disabled={!canJoin}
      onClick={() => window.open(meetLink, '_blank')}
      className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
        canJoin
          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 cursor-pointer' 
          : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
      }`}
    >
      {canJoin ? <Video size={18} /> : <Lock size={18} />}
      {canJoin ? 'Join Google Meet' : timeMessage}
    </button>
  );
};

export default JoinMeetingButton;