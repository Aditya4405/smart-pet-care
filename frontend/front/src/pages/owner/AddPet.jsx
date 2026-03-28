import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, ChevronRight, ChevronLeft, UploadCloud, PawPrint, 
  Calendar, Activity, FileText, Camera, AlertCircle, Dog, Cat, Syringe 
} from 'lucide-react';
import toast from 'react-hot-toast'; 
import { API } from '../../config/api';

const API_BASE = API.BASE_API;

// --- MOCK DATA ---
const SPECIES_OPTIONS = [
  { id: 'dog', label: 'Dog', icon: Dog },
  { id: 'cat', label: 'Cat', icon: Cat },
  { id: 'other', label: 'Other', icon: PawPrint }
];

const GENDER_OPTIONS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' }
];

const AddPet = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    dob: '',
    weight: '',
    vaccinated: false,
    neutered: false,
    allergies: '',
    conditions: '',
    primaryVet: '',
    lastCheckup: '',
    medications: '',
    // --- NEW REAL VACCINATION FIELDS ---
    rabiesDate: '',
    parvoDate: '',
    bordetellaDate: '',
    image: null,
    imagePreview: null,
    medicalDocument: null 
  });

  const [errors, setErrors] = useState({});

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const validateStep = (currentStep) => {
    const newErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.name) newErrors.name = 'Pet name is required';
      if (!formData.species) newErrors.species = 'Species is required';
      if (!formData.breed) newErrors.breed = 'Breed is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      if (!formData.weight) newErrors.weight = 'Weight is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    } else {
      setErrors({});
    }
    return isValid;
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userStr || !token) {
            toast.error("Authentication error. Please log in again.");
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);
        
        // 1. Map to Entity structure
        const petPayload = {
            name: formData.name,
            species: formData.species,
            breed: formData.breed,
            gender: formData.gender,
            weight: formData.weight,
            dateOfBirth: formData.dob,
            vaccinated: formData.vaccinated,
            neutered: formData.neutered,
            allergies: formData.allergies,
            existingConditions: formData.conditions,
            primaryVet: formData.primaryVet,
            lastCheckupDate: formData.lastCheckup,
            currentMedications: formData.medications,
            // SENDING THE NEW DATES
            rabiesDate: formData.rabiesDate,
            parvoDate: formData.parvoDate,
            bordetellaDate: formData.bordetellaDate
        };

        const submitData = new FormData();
        submitData.append("pet", JSON.stringify(petPayload));
        
        if (formData.image) submitData.append("image", formData.image);
        if (formData.medicalDocument) submitData.append("medicalDocument", formData.medicalDocument);

        const response = await fetch(`${API_BASE}/pets/owner/${user.id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: submitData
        });

        if (response.ok) {
            toast.success("Pet added successfully!");
            navigate('/owner/pets'); 
        } else {
            const errorText = await response.text();
            toast.error("Failed to add pet: " + errorText);
        }

    } catch (error) {
        console.error("Submission Error:", error);
        toast.error("Connection failed.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <StepBasicInfo formData={formData} setFormData={setFormData} errors={errors} />;
      case 2: return <StepHealthDetails formData={formData} setFormData={setFormData} />;
      case 3: return <StepMedicalInfo formData={formData} setFormData={setFormData} />;
      case 4: return <StepPhotoUpload formData={formData} setFormData={setFormData} />;
      case 5: return <StepReview formData={formData} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-teal-600 mb-2 flex items-center gap-1 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Add New Pet</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Let's track your pet's medical journey.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between relative">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <div key={item} className="flex flex-col items-center relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step >= item 
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30 scale-110' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {step > item ? <CheckCircle className="w-5 h-5" /> : item}
                  </div>
                  <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                    step >= item ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400'
                  }`}>
                    {['Basics', 'Health', 'Medical', 'Photo', 'Review'][index]}
                  </span>
                </div>
              ))}
              <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -z-0 rounded-full"></div>
              <div className="absolute top-5 left-0 h-1 bg-teal-600 -z-0 rounded-full transition-all duration-500 ease-out" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-800 p-8 min-h-[450px] relative transition-all duration-300">
            {renderStep()}
          </div>

          <div className="flex justify-between items-center pt-2">
            {step > 1 ? (
              <button onClick={handleBack} className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Back</button>
            ) : <div></div>}
            
            {step < 5 ? (
              <button onClick={handleNext} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-95 flex items-center gap-2">Continue <ChevronRight className="w-4 h-4" /></button>
            ) : (
              <button onClick={handleSave} disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70">{isSubmitting ? 'Saving...' : 'Confirm & Save'} <CheckCircle className="w-4 h-4" /></button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Live Preview</h3>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-90"></div>
              <div className="relative z-10 flex flex-col items-center mt-8">
                <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-md overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  {formData.imagePreview ? <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <PawPrint className="w-10 h-10 text-slate-300 dark:text-slate-500" />}
                </div>
                <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{formData.name || 'Pet Name'}</h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">{formData.breed || 'Breed'} • {formData.species || 'Species'}</p>
                <div className="mt-6 w-full grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-400 uppercase font-bold">Gender</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">{formData.gender || '-'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-400 uppercase font-bold">Weight</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">{formData.weight ? `${formData.weight} kg` : '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- UPDATED STEP 2 (COLLECTING REAL VACCINATION DATES) ---
const StepHealthDetails = ({ formData, setFormData }) => (
  <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Vaccination History</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Input the last date your pet received these vaccines to enable reminders.</p>
    
    <div className="grid grid-cols-1 gap-4">
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <Syringe className="text-teal-600 dark:text-teal-400" size={24} />
          <div className="flex-1">
             <label className="text-xs font-bold text-slate-400 uppercase">Last Rabies Vaccination</label>
             <input type="date" value={formData.rabiesDate} onChange={e => setFormData({...formData, rabiesDate: e.target.value})} className="w-full mt-1 bg-transparent text-slate-900 dark:text-white outline-none" />
          </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <Syringe className="text-indigo-600 dark:text-indigo-400" size={24} />
          <div className="flex-1">
             <label className="text-xs font-bold text-slate-400 uppercase">Last Parvovirus Vaccination</label>
             <input type="date" value={formData.parvoDate} onChange={e => setFormData({...formData, parvoDate: e.target.value})} className="w-full mt-1 bg-transparent text-slate-900 dark:text-white outline-none" />
          </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <Syringe className="text-pink-600 dark:text-pink-400" size={24} />
          <div className="flex-1">
             <label className="text-xs font-bold text-slate-400 uppercase">Last Bordetella Vaccination</label>
             <input type="date" value={formData.bordetellaDate} onChange={e => setFormData({...formData, bordetellaDate: e.target.value})} className="w-full mt-1 bg-transparent text-slate-900 dark:text-white outline-none" />
          </div>
      </div>
      
      <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">Neutered / Spayed</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Has your pet been fixed?</p>
        </div>
        <ToggleSwitch checked={formData.neutered} onChange={(val) => setFormData({...formData, neutered: val})} />
      </div>
    </div>
  </div>
);

// --- REST OF HELPER COMPONENTS (MAINTAINING ORIGINAL STYLE) ---
const StepBasicInfo = ({ formData, setFormData, errors }) => {
  const handleSpeciesSelect = (id) => setFormData({ ...formData, species: id });
  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Pet Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Bella" error={errors.name} />
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Species</label>
          <div className="grid grid-cols-3 gap-3">
            {SPECIES_OPTIONS.map((option) => (
              <button 
                key={option.id} 
                onClick={() => handleSpeciesSelect(option.id)} 
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  formData.species === option.id 
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                }`} 
                type="button"
              >
                <option.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-bold">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
        <InputField label="Breed" value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})} error={errors.breed} />
        <InputField label="Date of Birth" type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} error={errors.dob} />
        <InputField label="Weight (kg)" type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} error={errors.weight} />
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Gender</label>
          <div className="flex gap-4">
            {GENDER_OPTIONS.map((option) => (
              <label key={option.id} className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                formData.gender === option.id 
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}>
                <input type="radio" value={option.id} checked={formData.gender === option.id} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="hidden" />
                <span className="font-bold text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StepMedicalInfo = ({ formData, setFormData }) => (
  <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Medical Information</h2>
    <InputField label="Primary Veterinarian" value={formData.primaryVet} onChange={(e) => setFormData({...formData, primaryVet: e.target.value})} />
    <TextAreaField label="Current Medications" value={formData.medications} onChange={(e) => setFormData({...formData, medications: e.target.value})} />
    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative">
      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFormData({...formData, medicalDocument: e.target.files[0]})} />
      <FileText className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
      <p className="font-bold text-slate-900 dark:text-white">Upload Medical Records</p>
      <p className="text-xs text-slate-400 dark:text-slate-500">{formData.medicalDocument ? formData.medicalDocument.name : 'PDF or Image'}</p>
    </div>
  </div>
);

const StepPhotoUpload = ({ formData, setFormData }) => (
  <div className="text-center space-y-8 animate-in slide-in-from-right-8 duration-300">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Profile Photo</h2>
    <div className="relative w-48 h-48 mx-auto group">
      <div className="w-full h-full rounded-full border-4 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden transition-colors group-hover:border-teal-500">
        {formData.imagePreview ? (
          <img src={formData.imagePreview} className="w-full h-full object-cover" alt="Preview" />
        ) : (
          <Camera className="w-12 h-12 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 transition-colors" />
        )}
      </div>
      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFormData({...formData, image: e.target.files[0], imagePreview: URL.createObjectURL(e.target.files[0])})} />
    </div>
    <p className="text-sm text-slate-500 dark:text-slate-400">Click the circle to upload a clear photo of your pet.</p>
  </div>
);

// ✅ FIXED REVIEW STEP
const StepReview = ({ formData }) => (
  <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
    <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white">Review Pet Profile</h2>
    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-2">
      <ReviewRow label="Name" value={formData.name} />
      <ReviewRow label="Species" value={formData.species} />
      <ReviewRow label="Breed" value={formData.breed} />
      <ReviewRow label="Rabies Date" value={formData.rabiesDate || 'Not Set'} />
      <ReviewRow label="Parvo Date" value={formData.parvoDate || 'Not Set'} />
    </div>
  </div>
);

// ✅ FIXED REUSABLE INPUTS
const InputField = ({ label, type = 'text', value, onChange, placeholder, error }) => (
  <div className="w-full">
    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors ${
        error ? 'border-red-500 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
      }`} 
    />
  </div>
);

const TextAreaField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
    <textarea 
      value={value} 
      onChange={onChange} 
      className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none outline-none focus:ring-2 focus:ring-teal-500 transition-colors" 
    />
  </div>
);

const ToggleSwitch = ({ checked, onChange }) => (
  <button type="button" onClick={() => onChange(!checked)} className={`w-12 h-7 rounded-full p-1 transition-colors ${checked ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const ReviewRow = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
    <span className="text-slate-500 dark:text-slate-400 font-medium">{label}</span>
    <span className="font-bold capitalize text-slate-900 dark:text-white">{value}</span>
  </div>
);

export default AddPet;