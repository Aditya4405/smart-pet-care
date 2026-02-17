import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format, parseISO, isAfter, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const FollowUpCard = ({ appointment }) => {
  const navigate = useNavigate();
  const { doctorName, specialty, followUpAllowedUntil, followUpUsed, price, petName } = appointment;

  // Logic to check if window is valid
  const isExpired = followUpAllowedUntil && !isAfter(parseISO(followUpAllowedUntil), new Date());
  const remainingDays = followUpAllowedUntil 
    ? differenceInDays(parseISO(followUpAllowedUntil), new Date()) 
    : 0;

  const handleBookFollowUp = () => {
    // Navigate to Booking Page with "Free" flag
    navigate('/owner/appointments/book', { 
      state: { 
        preSelectedDoctor: { name: doctorName, specialty: specialty, price: price }, // Mock Doc Object
        isFreeFollowUp: true,
        originalAppointmentId: appointment.id
      } 
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{doctorName}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{specialty}</p>
        </div>
        
        {/* Status Badge */}
        {!isExpired && !followUpUsed ? (
           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
             <CheckCircle className="w-3 h-3 mr-1" /> Active
           </span>
        ) : (
           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
             <AlertCircle className="w-3 h-3 mr-1" /> Expired
           </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-slate-500">Pet: <span className="font-bold text-slate-700 dark:text-slate-300">{petName}</span></p>
        
        {!isExpired && !followUpUsed && (
          <div className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
            <Clock className="w-3 h-3 mr-2" />
            <span>Free visit expires in {remainingDays} days</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex flex-col">
           <span className="text-[10px] uppercase font-bold text-slate-400">Consultation Fee</span>
           <div className="flex items-center gap-2">
             {!isExpired && !followUpUsed ? (
               <>
                 <span className="text-lg font-bold text-emerald-600">FREE</span>
                 <span className="text-sm text-slate-400 line-through">${price}</span>
               </>
             ) : (
               <span className="text-lg font-bold text-slate-900 dark:text-white">${price}</span>
             )}
           </div>
        </div>

        <button
          onClick={handleBookFollowUp}
          disabled={isExpired || followUpUsed}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            !isExpired && !followUpUsed
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {!isExpired && !followUpUsed ? 'Book Free Visit' : 'Book Regular'}
        </button>
      </div>
    </div>
  );
};

export default FollowUpCard;