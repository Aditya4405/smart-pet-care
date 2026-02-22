import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, CheckCircle, ChevronRight, ChevronLeft, 
  Star, FileText, Upload, CreditCard, Video, Building, Zap, AlertTriangle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. DATA FROM NAVIGATION STATE ---
  const isFreeFollowUp = location.state?.isFreeFollowUp || false;
  const preSelectedDoctor = location.state?.preSelectedDoctor || null;

  // --- 2. STEPS ---
  const steps = [
    { id: 1, name: 'Patient' },
    { id: 2, name: 'Visit Type' }, 
    { id: 3, name: 'Doctor' },
    { id: 4, name: 'Schedule' },
    { id: 5, name: 'Details' },
    { id: 6, name: 'Confirm' }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  
  // Form State
  const [pets, setPets] = useState([]); 
  const [isLoadingPets, setIsLoadingPets] = useState(true); 
  const [selectedPet, setSelectedPet] = useState(null);
  
  // --- NEW: STATE FOR REAL VETS ---
  const [vets, setVets] = useState([]); 
  const [isLoadingVets, setIsLoadingVets] = useState(true); 

  const [visitType, setVisitType] = useState('clinic'); 
  const [selectedDoctor, setSelectedDoctor] = useState(preSelectedDoctor);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [medicalReport, setMedicalReport] = useState(null);

  // --- FETCH REAL PETS & VETS ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userStr || !token) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(userStr);
        
        // 1. Fetch Pets
        const petResponse = await fetch(`http://localhost:8082/api/pets/owner/${user.id}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (petResponse.ok) {
          const petData = await petResponse.json();
          const formattedPets = petData.map(pet => ({
            id: pet.id,
            name: pet.name,
            breed: pet.breed || pet.species || 'Unknown',
            image: pet.imageUrl 
                ? `http://localhost:8082/uploads/${pet.imageUrl}` 
                : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80',
          }));
          setPets(formattedPets);
        }

        // 2. Fetch Vets (Replacing the Mock Data)
        const vetResponse = await fetch('http://localhost:8082/api/users/approved-vets', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (vetResponse.ok) {
            const vetData = await vetResponse.json();
            const formattedVets = vetData.map(vet => ({
                id: vet.id,
                name: `Dr. ${vet.firstName} ${vet.lastName}`,
                specialty: vet.specialization || 'General',
                clinic: vet.clinicName || 'Independent Practice',
                rating: 4.8, 
                image: `https://ui-avatars.com/api/?name=${vet.firstName}+${vet.lastName}&background=10b981&color=fff&size=256`,
                originalData: vet
            }));
            setVets(formattedVets);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingPets(false);
        setIsLoadingVets(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Auto-select doctor if coming from "Find Vet"
  useEffect(() => {
    if (preSelectedDoctor) {
        setSelectedDoctor(preSelectedDoctor);
    }
  }, [preSelectedDoctor]);

  // Handle Emergency Auto-Schedule
  useEffect(() => {
    if (visitType === 'emergency') {
        setSelectedDate('Today');
        setSelectedTime('ASAP (Immediate)');
    } else if (selectedDate === 'Today' && selectedTime === 'ASAP (Immediate)') {
        setSelectedDate(null);
        setSelectedTime(null);
    }
  }, [visitType]);

  const timeSlots = ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];
  
  // --- 3. DYNAMIC PRICING LOGIC ---
  const baseFee = isFreeFollowUp ? 0 : 500;
  const emergencyFee = visitType === 'emergency' ? 1000 : 0;
  const totalFee = baseFee + emergencyFee;

  // --- Handlers ---
  const handleNext = () => { if (currentStep < steps.length) setCurrentStep(c => c + 1); };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(c => c - 1); };
  const handleFileChange = (e) => { if (e.target.files && e.target.files[0]) setMedicalReport(e.target.files[0]); };

  // --- SUBMIT APPOINTMENT TO BACKEND ---
  const saveAppointmentToDatabase = async () => {
    try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const user = JSON.parse(userStr);

        const payloadData = {
            ownerId: user.id,
            vetId: selectedDoctor.id, 
            petId: selectedPet.id,
            appointmentDate: selectedDate,
            appointmentTime: selectedTime,
            visitType: visitType,
            symptoms: symptoms || "No symptoms provided",
            amountPaid: totalFee
        };

        const submitData = new FormData();
        submitData.append("appointmentData", JSON.stringify(payloadData));
        
        if (medicalReport) {
            submitData.append("medicalReport", medicalReport);
        }

        const response = await fetch('http://localhost:8082/api/appointments/book', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: submitData
        });

        if (response.ok) {
            toast.success(visitType === 'emergency' ? "Emergency booked! Redirecting..." : "Booking Confirmed!");
            navigate('/owner/dashboard'); // Redirect to dashboard after saving
        } else {
            const errorText = await response.text();
            toast.error("Failed to save booking: " + errorText);
        }
    } catch (error) {
        console.error("Booking error:", error);
        toast.error("Network error while saving appointment.");
    }
  };

  // --- TEMPORARY PAYMENT BYPASS TO TEST SAVING ---
  const handlePayment = () => {
    toast.success("Simulating successful payment...");
    saveAppointmentToDatabase();
  };

  // --- RENDER STEPS ---

  const renderStep1_Pet = () => {
    if (isLoadingPets) {
        return (
            <div className="flex items-center justify-center h-48 animate-in fade-in slide-in-from-right-4">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Who is this visit for?</h3>
          
          {pets.length === 0 ? (
              <div className="text-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                  <p className="text-slate-500 mb-4">You haven't added any pets yet.</p>
                  <button 
                      onClick={() => navigate('/owner/pets/add')} 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold transition-all"
                  >
                      Add a Pet to Continue
                  </button>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pets.map(pet => (
                      <div key={pet.id} onClick={() => setSelectedPet(pet)} className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all ${selectedPet?.id === pet.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200'}`}>
                          <img src={pet.image} alt={pet.name} className="w-12 h-12 rounded-full object-cover bg-slate-100" />
                          <div>
                              <p className="font-bold text-slate-900 dark:text-white">{pet.name}</p>
                              <p className="text-xs text-slate-500 capitalize">{pet.breed}</p>
                          </div>
                          {selectedPet?.id === pet.id && <CheckCircle className="ml-auto w-5 h-5 text-emerald-500" />}
                      </div>
                  ))}
                  <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 font-bold" onClick={()=>navigate('/owner/pets/add')}>
                    + Add New Pet
                  </div>
              </div>
          )}
      </div>
    );
  };

  const renderStep2_Mode = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">How would you like to consult?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div onClick={() => setVisitType('clinic')} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${visitType === 'clinic' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${visitType === 'clinic' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}><Building className="w-6 h-6" /></div>
                <h4 className="font-bold text-slate-900 dark:text-white">In-Clinic Visit</h4>
                <p className="text-xs text-slate-500 mt-2">Standard offline consultation at the vet's office.</p>
            </div>
            <div onClick={() => setVisitType('video')} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${visitType === 'video' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-200'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${visitType === 'video' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}><Video className="w-6 h-6" /></div>
                <h4 className="font-bold text-slate-900 dark:text-white">Video Consult</h4>
                <p className="text-xs text-slate-500 mt-2">Consult from home. Meet link will be emailed to you.</p>
            </div>
            <div onClick={() => setVisitType('emergency')} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${visitType === 'emergency' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md ring-2 ring-red-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-red-200'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${visitType === 'emergency' ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}><Zap className="w-6 h-6" /></div>
                <h4 className="font-bold text-slate-900 dark:text-white">Emergency (ASAP)</h4>
                <p className="text-xs text-red-600 mt-2 font-bold">+₹1000 Surcharge</p>
                <p className="text-[10px] text-slate-500 mt-1">Connect immediately. Skips waiting queue.</p>
            </div>
        </div>
    </div>
  );

  const renderStep3_Doctor = () => {
    if (isLoadingVets) {
        return (
            <div className="flex items-center justify-center h-48 animate-in fade-in slide-in-from-right-4">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    // If a doctor was pre-selected from FindVet, only show them (unless it's an emergency, then show all)
    const displayedVets = (preSelectedDoctor && visitType !== 'emergency') ? [preSelectedDoctor] : vets;

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {visitType === 'emergency' ? 'Available Emergency Vets' : 'Choose a Specialist'}
            </h3>
            
            {isFreeFollowUp && (
                 <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 p-3 rounded-lg flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-300 text-sm font-bold">
                    <CheckCircle className="w-4 h-4" /> Free Follow-Up Visit Applied
                 </div>
            )}
            {visitType === 'emergency' && (
                 <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 p-3 rounded-lg flex items-center gap-2 mb-4 text-red-700 dark:text-red-400 text-sm font-bold">
                    <AlertTriangle className="w-4 h-4" /> Showing vets currently online and available.
                 </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedVets.map(doc => (
                     <div key={doc.id} onClick={() => setSelectedDoctor(doc)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex gap-4 ${selectedDoctor?.id === doc.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'}`}>
                        <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-xl object-cover bg-emerald-50" />
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                            <p className="text-sm text-emerald-600 font-medium">{doc.specialty}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                                 <Star className="w-3 h-3 text-amber-400 fill-current" /> {doc.rating} • {visitType === 'clinic' ? doc.clinic : 'Online'}
                            </div>
                        </div>
                     </div>
                ))}
            </div>
            
            {displayedVets.length === 0 && (
                <div className="text-center p-6 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500">
                    No approved doctors found in the system.
                </div>
            )}
        </div>
    );
  };

  const renderStep4_DateTime = () => {
    if (visitType === 'emergency') {
        return (
            <div className="text-center py-12 space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <Zap className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Immediate Connection</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                    You have selected an emergency visit. You will bypass the standard schedule and connect with the vet immediately after payment.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Select Date</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {[0,1,2,3,4].map(dayOffset => {
                        const date = new Date();
                        date.setDate(date.getDate() + dayOffset);
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                        const dayNum = date.getDate();
                        const fullDate = date.toISOString().split('T')[0];

                        return (
                            <button key={dayOffset} onClick={() => setSelectedDate(fullDate)} className={`min-w-[70px] p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${selectedDate === fullDate ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400'}`}>
                                <span className="text-xs font-medium uppercase opacity-80">{dayName}</span>
                                <span className="text-xl font-bold">{dayNum}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Select Time</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map(time => (
                        <button key={time} onClick={() => setSelectedTime(time)} className={`py-2 px-4 rounded-lg text-sm font-bold border transition-all ${selectedTime === time ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'}`}>
                            {time}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
  };

  const renderStep5_Additional = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
        <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
               <FileText className="w-5 h-5" /> Reason for Visit (Optional)
            </h3>
            <textarea 
                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder={visitType === 'emergency' ? "Briefly describe the emergency..." : "Describe symptoms, notes, or any questions for the doctor..."}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
            />
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
               <Upload className="w-5 h-5" /> Medical Reports (Optional)
            </h3>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 relative">
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.jpg,.png" />
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3 text-slate-500"><Upload className="w-6 h-6" /></div>
                {medicalReport ? <p className="font-bold text-emerald-600">{medicalReport.name}</p> : <><p className="font-bold text-slate-900 dark:text-white">Click to upload report</p><p className="text-xs text-slate-500 mt-1">PDF, JPG, or PNG (Max 5MB)</p></>}
            </div>
        </div>
    </div>
  );

  const renderStep6_Confirm = () => (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-right-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">Confirm & Pay</h3>
        
        <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-medium">Type</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1
                    ${visitType === 'emergency' ? 'bg-red-100 text-red-700' : visitType === 'video' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
                    {visitType === 'emergency' ? <Zap className="w-3 h-3"/> : visitType === 'video' ? <Video className="w-3 h-3"/> : <Building className="w-3 h-3"/>}
                    {visitType}
                </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-medium">Patient</span>
                <div className="flex items-center gap-2">
                    <img src={selectedPet?.image} className="w-6 h-6 rounded-full object-cover" alt="Pet" />
                    <span className="font-bold text-slate-900 dark:text-white">{selectedPet?.name}</span>
                </div>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-medium">Doctor</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedDoctor?.name}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-medium">Date & Time</span>
                <div className="text-right">
                    <p className={`font-bold ${visitType === 'emergency' ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>{selectedDate}</p>
                    <p className="text-xs text-slate-500">{selectedTime}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                 <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>Base Consultation {isFreeFollowUp && <span className="text-emerald-500 font-bold">(Follow-Up)</span>}</span>
                    <span>₹{baseFee}</span>
                 </div>
                 {visitType === 'emergency' && (
                     <div className="flex justify-between text-sm text-red-500 font-medium">
                        <span>Emergency Surcharge</span>
                        <span>+₹{emergencyFee}</span>
                     </div>
                 )}
                 <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-900 dark:text-white font-bold">Total Amount</span>
                    <span className={`font-bold text-xl ${totalFee === 0 ? 'text-emerald-600' : visitType === 'emergency' ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                        {totalFee === 0 ? 'FREE' : `₹${totalFee}.00`}
                    </span>
                 </div>
            </div>

            {visitType === 'video' && (
                 <p className="text-xs text-center text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg mt-4">
                    📧 A Google Meet link will be sent to your registered email address.
                 </p>
            )}
            {visitType === 'emergency' && (
                 <p className="text-xs text-center text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg mt-4 font-medium">
                    🚨 You will be redirected to the live video room immediately after payment.
                 </p>
            )}
        </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Stepper */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Book Appointment</h1>
        <div className="flex items-center gap-1 sm:gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
            {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep >= step.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                        {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                    </div>
                    {/* Hide line after last step */}
                    {step.id !== steps.length && (
                        <div className={`w-6 sm:w-10 h-1 rounded-full ${currentStep > step.id ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 min-h-[400px] flex flex-col overflow-hidden">
          
          {/* Step Content */}
          <div className="flex-grow">
            {currentStep === 1 && renderStep1_Pet()}
            {currentStep === 2 && renderStep2_Mode()}
            {currentStep === 3 && renderStep3_Doctor()}
            {currentStep === 4 && renderStep4_DateTime()}
            {currentStep === 5 && renderStep5_Additional()}
            {currentStep === 6 && renderStep6_Confirm()}
          </div>

          {/* Navigation Footer */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors ${currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              {currentStep === 6 ? (
                  <button 
                    onClick={handlePayment}
                    className={`px-6 sm:px-8 py-2.5 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95
                        ${visitType === 'emergency' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30'}
                    `}
                  >
                    {totalFee === 0 ? 'Confirm (Free)' : `Pay ₹${totalFee}`} <CreditCard className="w-4 h-4" />
                  </button>
              ) : (
                  <button 
                    onClick={handleNext}
                    disabled={
                        (currentStep === 1 && !selectedPet) ||
                        (currentStep === 2 && !visitType) ||
                        (currentStep === 3 && !selectedDoctor) ||
                        (currentStep === 4 && (!selectedDate || !selectedTime))
                    }
                    className="px-6 sm:px-8 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 rounded-xl font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentStep === 5 ? 'Review & Pay' : 'Next'} <ChevronRight className="w-4 h-4" />
                  </button>
              )}
          </div>
      </div>

    </div>
  );
};

export default BookAppointment;