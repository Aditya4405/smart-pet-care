import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, CheckCircle, ChevronRight, ChevronLeft, 
  Stethoscope, UploadCloud, CreditCard, Wallet, ShieldCheck, AlertCircle 
} from 'lucide-react';

// --- UPDATED MOCK DATA WITH FEES ---
const PETS = [
  { id: 1, name: 'Bella', type: 'Dog', breed: 'Golden Retriever', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=100&q=80' },
  { id: 2, name: 'Luna', type: 'Cat', breed: 'Siamese', img: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=100&q=80' },
];

const VETS = [
  { id: 1, name: 'Dr. Sarah Smith', special: 'General Surgeon', rating: 4.9, fee: 50, img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 2, name: 'Dr. James Doe', special: 'Dermatologist', rating: 4.7, fee: 40, img: 'https://randomuser.me/api/portraits/men/32.jpg' },
];

const SLOTS = ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'];

// --- MAIN COMPONENT ---
const BookAppointment = () => {
  const navigate = useNavigate();
  // Increased steps to 6 (Added Payment Step)
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    petId: null,
    vetId: null,
    serviceType: 'Checkup',
    date: '',
    time: '',
    symptoms: '',
    paymentMethod: 'card' // Default
  });

  const handleNext = () => {
    // specific logic for Payment Step (Step 5)
    if (step === 5) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(6); // Go to Success
      }, 2000); // Simulate 2s payment delay
    } else {
      setStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  // --- RENDER STEPS ---
  const renderStep = () => {
    switch (step) {
      case 1: return <StepSelectPet formData={formData} setFormData={setFormData} />;
      case 2: return <StepSelectVet formData={formData} setFormData={setFormData} />;
      case 3: return <StepDateTime formData={formData} setFormData={setFormData} />;
      case 4: return <StepDetails formData={formData} setFormData={setFormData} />;
      case 5: return <StepPayment formData={formData} setFormData={setFormData} />; // NEW STEP
      case 6: return <StepConfirmation formData={formData} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header & Progress */}
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-teal-600 mb-4 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Book Appointment</h1>
        
        {/* Stepper (Updated for 6 Steps) */}
        <div className="flex items-center mt-6 relative">
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <div key={item} className="flex items-center flex-1 last:flex-none relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step >= item ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {step > item ? <CheckCircle className="w-5 h-5" /> : item}
              </div>
              {index < 5 && (
                <div className={`h-1 w-full mx-2 rounded-full transition-all duration-300 ${
                  step > item ? 'bg-teal-600' : 'bg-slate-200 dark:bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-800 p-8 min-h-[450px] relative transition-all">
        {renderStep()}
      </div>

      {/* Footer Controls */}
      <div className="mt-8 flex justify-between items-center">
        {step > 1 && step < 6 && (
          <button onClick={handleBack} disabled={isProcessing} className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
            Back
          </button>
        )}
        
        {step < 6 ? (
          <button 
            onClick={handleNext}
            disabled={
              (step === 1 && !formData.petId) ||
              (step === 2 && !formData.vetId) ||
              (step === 3 && (!formData.date || !formData.time)) ||
              isProcessing
            }
            className="ml-auto bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-95 flex items-center gap-2"
          >
            {isProcessing ? 'Processing...' : (step === 5 ? 'Pay & Confirm' : 'Continue')} 
            {!isProcessing && <ChevronRight className="w-4 h-4" />}
          </button>
        ) : (
          <button onClick={() => navigate('/owner/dashboard')} className="ml-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95">
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StepSelectPet = ({ formData, setFormData }) => (
  <div className="animate-in slide-in-from-right-8 duration-300">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Who is this visit for?</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {PETS.map((pet) => (
        <div 
          key={pet.id}
          onClick={() => setFormData({ ...formData, petId: pet.id })}
          className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
            formData.petId === pet.id 
              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-md' 
              : 'border-slate-200 dark:border-slate-700 hover:border-teal-200 dark:hover:border-slate-600'
          }`}
        >
          <img src={pet.img} alt={pet.name} className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{pet.name}</h3>
            <p className="text-sm text-slate-500">{pet.breed}</p>
          </div>
          {formData.petId === pet.id && <CheckCircle className="ml-auto w-6 h-6 text-teal-600" />}
        </div>
      ))}
    </div>
  </div>
);

const StepSelectVet = ({ formData, setFormData }) => (
  <div className="animate-in slide-in-from-right-8 duration-300">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Choose a Specialist</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {VETS.map((vet) => (
        <div 
          key={vet.id}
          onClick={() => setFormData({ ...formData, vetId: vet.id })}
          className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${
            formData.vetId === vet.id 
              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-md scale-[1.02]' 
              : 'border-slate-200 dark:border-slate-700 hover:border-teal-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <img src={vet.img} className="w-14 h-14 rounded-xl object-cover shadow-sm" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 dark:text-white">{vet.name}</h3>
                <span className="text-sm font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-lg">${vet.fee}</span>
              </div>
              <p className="text-sm text-slate-500 font-medium">{vet.special}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                ★ {vet.rating}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    
    <div className="mt-8">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Service Type</h3>
      <div className="flex gap-4">
        {['Checkup', 'Vaccination', 'Surgery'].map(service => (
          <button
            key={service}
            onClick={() => setFormData({ ...formData, serviceType: service })}
            className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${
              formData.serviceType === service
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900'
                : 'border-slate-300 text-slate-600 hover:border-slate-400'
            }`}
          >
            {service}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const StepDateTime = ({ formData, setFormData }) => (
  <div className="animate-in slide-in-from-right-8 duration-300">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Select Time Slot</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4"/> Select Date</h3>
        <input 
          type="date" 
          className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-teal-500"
          onChange={(e) => setFormData({...formData, date: e.target.value})}
        />
      </div>

      <div>
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2"><Clock className="w-4 h-4"/> Available Slots</h3>
        <div className="grid grid-cols-2 gap-3">
          {SLOTS.map((slot) => (
            <button
              key={slot}
              onClick={() => setFormData({ ...formData, time: slot })}
              className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                formData.time === slot
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:border-teal-400'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const StepDetails = ({ formData, setFormData }) => (
  <div className="animate-in slide-in-from-right-8 duration-300">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Additional Details</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Describe Symptoms</label>
        <textarea 
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 outline-none h-32 resize-none transition-all"
          placeholder="e.g. Not eating properly, lethargic..."
          value={formData.symptoms}
          onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
        />
      </div>
      
      <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors group">
        <div className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6 text-teal-600" />
        </div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Upload Medical Reports</p>
      </div>
    </div>
  </div>
);

// --- NEW PAYMENT STEP ---
const StepPayment = ({ formData, setFormData }) => {
  const selectedVet = VETS.find(v => v.id === formData.vetId);
  const consultFee = selectedVet ? selectedVet.fee : 0;
  const platformFee = 5; // Fixed fee
  const total = consultFee + platformFee;

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Payment Methods */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Payment Method</h2>
        <div className="space-y-4">
          {/* Card Option */}
          <div 
            onClick={() => setFormData({...formData, paymentMethod: 'card'})}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
              formData.paymentMethod === 'card' 
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Credit / Debit Card</p>
              <p className="text-xs text-slate-500">Visa, Mastercard, Amex</p>
            </div>
            {formData.paymentMethod === 'card' && <CheckCircle className="ml-auto w-5 h-5 text-teal-600" />}
          </div>

          {/* UPI/Wallet Option */}
          <div 
            onClick={() => setFormData({...formData, paymentMethod: 'wallet'})}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
              formData.paymentMethod === 'wallet' 
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">UPI / Wallets</p>
              <p className="text-xs text-slate-500">Google Pay, PhonePe, Paytm</p>
            </div>
            {formData.paymentMethod === 'wallet' && <CheckCircle className="ml-auto w-5 h-5 text-teal-600" />}
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
          <p>Your payment information is encrypted and secure. We do not store your card details.</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 h-fit">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Order Summary</h3>
        
        <div className="space-y-3 border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Consultation Fee</span>
            <span className="font-medium text-slate-900 dark:text-white">${consultFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Platform Fee</span>
            <span className="font-medium text-slate-900 dark:text-white">${platformFee.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-lg text-slate-900 dark:text-white">Total Pay</span>
          <span className="font-bold text-xl text-teal-600">${total.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
           <img src={selectedVet?.img} className="w-10 h-10 rounded-full object-cover" />
           <div className="text-sm">
              <p className="font-bold text-slate-900 dark:text-white">{selectedVet?.name}</p>
              <p className="text-slate-500">{formData.date} • {formData.time}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const StepConfirmation = ({ formData }) => {
  const pet = PETS.find(p => p.id === formData.petId);
  const vet = VETS.find(v => v.id === formData.vetId);

  return (
    <div className="text-center py-8 animate-in zoom-in duration-300">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful!</h2>
      <p className="text-slate-500 mb-8">Your appointment has been booked. ID: #APT-8839</p>

      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-left max-w-lg mx-auto shadow-sm">
        <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Service</p>
            <p className="font-bold text-slate-900 dark:text-white">{formData.serviceType}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase">Time</p>
            <p className="font-bold text-slate-900 dark:text-white">{formData.date} at {formData.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <img src={vet?.img} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{vet?.name}</p>
            <p className="text-sm text-slate-500">with {pet?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;