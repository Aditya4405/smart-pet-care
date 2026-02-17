import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, CheckCircle, ChevronRight, ChevronLeft, 
  User, Search, MapPin, Star, Stethoscope, FileText, Upload, CreditCard 
} from 'lucide-react';

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. NEW LOGIC: Check for Free Follow-Up Flag ---
  const isFreeFollowUp = location.state?.isFreeFollowUp || false;
  const preSelectedDoctor = location.state?.preSelectedDoctor || null;

  // Steps Configuration
  const steps = [
    { id: 1, name: 'Select Pet' },
    { id: 2, name: 'Choose Doctor' },
    { id: 3, name: 'Date & Time' },
    { id: 4, name: 'Additional Info' },
    { id: 5, name: 'Pay & Confirm' }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  
  // Form State
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(preSelectedDoctor);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  // Additional Info State
  const [symptoms, setSymptoms] = useState('');
  const [medicalReport, setMedicalReport] = useState(null);

  // Auto-select doctor if coming from "Find Vet"
  useEffect(() => {
    if (preSelectedDoctor) {
        setSelectedDoctor(preSelectedDoctor);
    }
  }, [preSelectedDoctor]);

  // Mock Data
  const pets = [
    { id: 101, name: 'Bella', type: 'Dog', breed: 'Golden Retriever', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80' },
    { id: 102, name: 'Luna', type: 'Cat', breed: 'Siamese', image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=150&q=80' },
  ];

  const doctorsList = [
    { id: 1, name: "Dr. Sarah Wilson", specialty: "Dermatology", clinic: "Happy Paws Clinic", rating: 4.9, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80" },
    { id: 2, name: "Dr. James Carter", specialty: "Surgery", clinic: "City Vet Hospital", rating: 4.8, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80" },
  ];

  const timeSlots = ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];
  
  // --- 2. NEW LOGIC: Dynamic Fee ---
  const consultationFee = isFreeFollowUp ? 0 : 500; // INR

  // --- Handlers ---
  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(c => c + 1);
  };
  
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMedicalReport(e.target.files[0]);
    }
  };

  // --- 3. UPDATED: Payment Integration ---
  const handlePayment = () => {
    // CASE A: Free Follow-Up (Skip Payment)
    if (isFreeFollowUp) {
        alert("Free Follow-Up Booked Successfully! ✅ No payment required.");
        navigate('/owner/dashboard');
        return;
    }

    // CASE B: Paid Appointment (Load Razorpay)
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onerror = () => alert('Razorpay SDK failed to load. Are you online?');
    
    script.onload = () => {
        const options = {
            key: "YOUR_TEST_KEY_ID", // Replace with your actual Razorpay Test Key ID
            amount: consultationFee * 100, // Amount in paise
            currency: "INR",
            name: "PetCare App",
            description: "Consultation Fee",
            image: "https://via.placeholder.com/150", 
            handler: function (response) {
                // Success Callback
                // alert(`Payment ID: ${response.razorpay_payment_id}`);
                
                // In a real app, verify signature on backend here
                alert("Payment Successful! Booking Confirmed.");
                navigate('/owner/dashboard');
            },
            prefill: {
                name: "Aditya Prajapati", // User's name from context
                email: "aditya@example.com",
                contact: "9999999999"
            },
            theme: {
                color: "#10B981" // Emerald-500
            }
        };

        const rzp1 = new window.Razorpay(options);
        
        rzp1.on('payment.failed', function (response){
            alert("Payment Failed: " + response.error.description);
        });

        rzp1.open();
    };
    
    document.body.appendChild(script);
  };

  // --- Render Steps ---

  const renderStep1_Pet = () => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Who is this visit for?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pets.map(pet => (
                <div 
                    key={pet.id} 
                    onClick={() => setSelectedPet(pet)}
                    className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all ${
                        selectedPet?.id === pet.id 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200'
                    }`}
                >
                    <img src={pet.image} alt={pet.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">{pet.name}</p>
                        <p className="text-xs text-slate-500">{pet.breed}</p>
                    </div>
                    {selectedPet?.id === pet.id && <CheckCircle className="ml-auto w-5 h-5 text-emerald-500" />}
                </div>
            ))}
             <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 font-bold" onClick={()=>navigate('/owner/pets/add')}>
                + Add New Pet
             </div>
        </div>
    </div>
  );

  const renderStep2_Doctor = () => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Choose a Specialist</h3>
        
        {/* --- 4. NEW VISUAL: Free Visit Banner --- */}
        {isFreeFollowUp && (
             <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 p-3 rounded-lg flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-300 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                <CheckCircle className="w-4 h-4" /> Free Follow-Up Visit Applied
             </div>
        )}

        {/* Existing Doctor Selection Logic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(preSelectedDoctor ? [preSelectedDoctor] : doctorsList).map(doc => (
                 <div 
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex gap-4 ${
                        selectedDoctor?.id === doc.id || (preSelectedDoctor?.id === doc.id && !selectedDoctor)
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md ring-1 ring-emerald-500' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                    }`}
                 >
                    <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                        <p className="text-sm text-emerald-600 font-medium">{doc.specialty}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                             <Star className="w-3 h-3 text-amber-400 fill-current" /> {doc.rating} • {doc.clinic}
                        </div>
                    </div>
                 </div>
            ))}
            {!isFreeFollowUp && preSelectedDoctor && (
                <button 
                    onClick={() => { alert("In a real app, this would clear filter."); }}
                    className="flex items-center justify-center p-4 text-sm font-bold text-slate-500 hover:text-emerald-600"
                >
                    Show other doctors
                </button>
            )}
        </div>
    </div>
  );

  const renderStep3_DateTime = () => (
    <div className="space-y-6">
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
                        <button 
                            key={dayOffset}
                            onClick={() => setSelectedDate(fullDate)}
                            className={`min-w-[70px] p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                                selectedDate === fullDate
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400'
                            }`}
                        >
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
                    <button 
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-4 rounded-lg text-sm font-bold border transition-all ${
                            selectedTime === time
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-500'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                        }`}
                    >
                        {time}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );

  const renderStep4_Additional = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
               <FileText className="w-5 h-5" /> Reason for Visit (Optional)
            </h3>
            <textarea 
                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Describe symptoms, notes, or any questions for the doctor..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
            />
        </div>

        <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
               <Upload className="w-5 h-5" /> Medical Reports (Optional)
            </h3>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 relative">
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept=".pdf,.jpg,.png"
                />
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3 text-slate-500">
                    <Upload className="w-6 h-6" />
                </div>
                {medicalReport ? (
                    <p className="font-bold text-emerald-600">{medicalReport.name}</p>
                ) : (
                    <>
                        <p className="font-bold text-slate-900 dark:text-white">Click to upload report</p>
                        <p className="text-xs text-slate-500 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                    </>
                )}
            </div>
        </div>
    </div>
  );

  const renderStep5_Confirm = () => (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">Confirm & Pay</h3>
        
        <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-medium">Patient</span>
                <div className="flex items-center gap-2">
                    <img src={selectedPet?.image} className="w-6 h-6 rounded-full" />
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
                    <p className="font-bold text-slate-900 dark:text-white">{selectedDate}</p>
                    <p className="text-xs text-slate-500">{selectedTime}</p>
                </div>
            </div>

            {/* Additional Info Summary */}
            {(symptoms || medicalReport) && (
                <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
                     <span className="text-slate-500 font-medium block mb-1">Additional Info</span>
                     {symptoms && <p className="text-sm text-slate-700 dark:text-slate-300 italic mb-1">"{symptoms}"</p>}
                     {medicalReport && (
                         <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                             <FileText className="w-3 h-3" /> Report Attached
                         </div>
                     )}
                </div>
            )}

            {/* --- 5. UPDATED VISUAL: Price Display --- */}
            <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500 font-medium">Consultation Fee</span>
                <span className={`font-bold text-xl ${isFreeFollowUp ? 'text-emerald-600' : 'text-emerald-600'}`}>
                    {isFreeFollowUp ? 'FREE (Follow-Up)' : `₹${consultationFee}.00`}
                </span>
            </div>
        </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Progress Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Book Appointment</h1>
        <div className="flex items-center gap-2 mt-4">
            {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        currentStep >= step.id 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}>
                        {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                    </div>
                    {step.id !== steps.length && (
                        <div className={`w-12 h-1 rounded-full ${currentStep > step.id ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 min-h-[400px] flex flex-col">
          
          {/* Step Content */}
          <div className="flex-grow">
            {currentStep === 1 && renderStep1_Pet()}
            {currentStep === 2 && renderStep2_Doctor()}
            {currentStep === 3 && renderStep3_DateTime()}
            {currentStep === 4 && renderStep4_Additional()}
            {currentStep === 5 && renderStep5_Confirm()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors ${
                    currentStep === 1 
                    ? 'text-slate-300 cursor-not-allowed' 
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              {currentStep === 5 ? (
                  <button 
                    onClick={handlePayment}
                    className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                  >
                    {/* --- 6. DYNAMIC BUTTON TEXT --- */}
                    {isFreeFollowUp ? 'Confirm Booking (Free)' : `Pay ₹${consultationFee} & Confirm`} <CreditCard className="w-4 h-4" />
                  </button>
              ) : (
                  <button 
                    onClick={handleNext}
                    disabled={
                        (currentStep === 1 && !selectedPet) ||
                        (currentStep === 2 && !selectedDoctor) ||
                        (currentStep === 3 && (!selectedDate || !selectedTime))
                    }
                    className="px-8 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 rounded-xl font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentStep === 4 ? 'Review & Pay' : 'Next Step'} <ChevronRight className="w-4 h-4" />
                  </button>
              )}
          </div>
      </div>

    </div>
  );
};

export default BookAppointment;