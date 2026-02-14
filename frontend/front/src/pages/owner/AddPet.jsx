import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, ChevronRight, ChevronLeft, UploadCloud, PawPrint, 
  Calendar, Activity, FileText, Camera, AlertCircle, Dog, Cat 
} from 'lucide-react';

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
    image: null,
    imagePreview: null
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

  const handleSave = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/owner/dashboard'); 
    }, 1500);
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
          <p className="text-slate-500 dark:text-slate-400 mt-1">Let's get to know your furry friend.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stepper */}
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
              <div 
                className="absolute top-5 left-0 h-1 bg-teal-600 -z-0 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${((step - 1) / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-800 p-8 min-h-[450px] relative transition-all duration-300">
            {renderStep()}
          </div>

          <div className="flex justify-between items-center pt-2">
            {step > 1 ? (
              <button 
                onClick={handleBack} 
                className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
            ) : <div></div>}
            
            {step < 5 ? (
              <button 
                onClick={handleNext}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-95 flex items-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Confirm & Save'} <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Live Preview</h3>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg relative overflow-hidden group transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-90"></div>
              
              <div className="relative z-10 flex flex-col items-center mt-8">
                <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-md overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <PawPrint className="w-10 h-10 text-slate-300" />
                  )}
                </div>
                
                <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                  {formData.name || 'Pet Name'}
                </h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">
                  {formData.breed || 'Breed'} • {formData.species || 'Species'}
                </p>

                <div className="mt-6 w-full grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase font-bold">Gender</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {formData.gender ? (formData.gender === 'male' ? 'Male ♂' : 'Female ♀') : '-'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase font-bold">Weight</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {formData.weight ? `${formData.weight} kg` : '-'}
                    </p>
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

// --- UPDATED BASIC INFO STEP (With "Specify Species" Logic) ---
const StepBasicInfo = ({ formData, setFormData, errors }) => {
  // Determine if we are in "Other" mode (species is not dog/cat, or it's empty but user clicked Other)
  const isPredefined = ['dog', 'cat'].includes(formData.species);
  const [isOther, setIsOther] = React.useState(!isPredefined && formData.species !== '');

  const handleSpeciesSelect = (id) => {
    if (id === 'other') {
      setIsOther(true);
      setFormData({ ...formData, species: '' }); // Clear to let them type
    } else {
      setIsOther(false);
      setFormData({ ...formData, species: id });
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Basic Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField 
          label="Pet Name" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          placeholder="e.g. Bella"
          error={errors.name}
        />
        
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Species</label>
          <div className="grid grid-cols-3 gap-3">
            {SPECIES_OPTIONS.map((option) => {
              // Highlight logic: 
              // If option is 'other', highlight if isOther is true
              // Else highlight if formData.species matches the option id
              const isActive = option.id === 'other' ? isOther : formData.species === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSpeciesSelect(option.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-teal-200 text-slate-500'
                  } ${errors.species ? 'border-red-300 bg-red-50' : ''}`}
                  type="button"
                >
                  <option.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">{option.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* CONDITIONAL TEXT BOX FOR OTHER */}
          {isOther && (
            <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
               <InputField 
                  label="Specify Species" 
                  value={formData.species} 
                  onChange={(e) => setFormData({...formData, species: e.target.value})} 
                  placeholder="e.g. Rabbit, Hamster, Bird"
                  error={errors.species} // Show error on this field
                  autoFocus
               />
            </div>
          )}
          {errors.species && !isOther && <p className="text-xs text-red-500 mt-1">{errors.species}</p>}
        </div>

        <InputField 
          label="Breed" 
          value={formData.breed} 
          onChange={(e) => setFormData({...formData, breed: e.target.value})} 
          placeholder="e.g. Golden Retriever"
          error={errors.breed}
        />

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Gender</label>
          <div className="flex gap-4">
            {GENDER_OPTIONS.map((option) => (
              <label key={option.id} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                formData.gender === option.id 
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-teal-200'
              }`}>
                <input 
                  type="radio" 
                  name="gender" 
                  value={option.id} 
                  checked={formData.gender === option.id}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="hidden"
                />
                <span className="font-bold text-sm">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
        </div>

        <InputField 
          label="Date of Birth" 
          type="date"
          value={formData.dob} 
          onChange={(e) => setFormData({...formData, dob: e.target.value})} 
          error={errors.dob}
        />

        <InputField 
          label="Weight (kg)" 
          type="number"
          value={formData.weight} 
          onChange={(e) => setFormData({...formData, weight: e.target.value})} 
          placeholder="e.g. 12.5"
          error={errors.weight}
        />
      </div>
    </div>
  );
};

const StepHealthDetails = ({ formData, setFormData }) => (
  <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Health Details</h2>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">Vaccinated</h3>
          <p className="text-xs text-slate-500">Is your pet up-to-date with shots?</p>
        </div>
        <ToggleSwitch checked={formData.vaccinated} onChange={(val) => setFormData({...formData, vaccinated: val})} />
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">Neutered / Spayed</h3>
          <p className="text-xs text-slate-500">Has your pet been fixed?</p>
        </div>
        <ToggleSwitch checked={formData.neutered} onChange={(val) => setFormData({...formData, neutered: val})} />
      </div>
      <TextAreaField label="Allergies (Optional)" value={formData.allergies} onChange={(e) => setFormData({...formData, allergies: e.target.value})} placeholder="List any known food or environmental allergies..." />
      <TextAreaField label="Existing Conditions (Optional)" value={formData.conditions} onChange={(e) => setFormData({...formData, conditions: e.target.value})} placeholder="Any chronic illnesses or past surgeries..." />
    </div>
  </div>
);

const StepMedicalInfo = ({ formData, setFormData }) => (
  <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Medical Information</h2>
    <div className="grid grid-cols-1 gap-6">
      <InputField label="Primary Veterinarian (Optional)" value={formData.primaryVet} onChange={(e) => setFormData({...formData, primaryVet: e.target.value})} placeholder="e.g. Dr. Smith" />
      <InputField label="Last Checkup Date" type="date" value={formData.lastCheckup} onChange={(e) => setFormData({...formData, lastCheckup: e.target.value})} />
      <TextAreaField label="Current Medications" value={formData.medications} onChange={(e) => setFormData({...formData, medications: e.target.value})} placeholder="List medications and dosage..." />
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
        <FileText className="w-8 h-8 text-slate-400 mb-2" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Upload Medical Records</p>
        <p className="text-xs text-slate-400">PDF or JPG up to 5MB</p>
      </div>
    </div>
  </div>
);

const StepPhotoUpload = ({ formData, setFormData }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: file, imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 text-center">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Upload Photo</h2>
      <p className="text-slate-500 text-sm mb-8">Add a clear photo of your pet for their profile.</p>
      <div className="relative w-48 h-48 mx-auto group cursor-pointer">
        <div className={`w-full h-full rounded-full border-4 border-dashed flex items-center justify-center overflow-hidden transition-all ${formData.imagePreview ? 'border-teal-500' : 'border-slate-300 dark:border-slate-700 hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
          {formData.imagePreview ? <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center text-slate-400"><Camera className="w-10 h-10 mb-2" /><span className="text-xs font-bold">Click to Upload</span></div>}
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        {formData.imagePreview && <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md border border-slate-200"><Activity className="w-4 h-4 text-teal-600" /></div>}
      </div>
    </div>
  );
};

const StepReview = ({ formData }) => (
  <div className="space-y-6 animate-in zoom-in duration-300">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-teal-600 dark:text-teal-400" /></div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review & Save</h2>
      <p className="text-slate-500 text-sm">Please verify the details before adding your pet.</p>
    </div>
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
      <ReviewRow label="Name" value={formData.name} />
      <ReviewRow label="Species" value={formData.species} />
      <ReviewRow label="Breed" value={formData.breed} />
      <ReviewRow label="Gender" value={formData.gender} />
      <ReviewRow label="Date of Birth" value={formData.dob} />
      <ReviewRow label="Vaccinated" value={formData.vaccinated ? 'Yes' : 'No'} highlight={formData.vaccinated} />
    </div>
  </div>
);

// Helper Components
const InputField = ({ label, type = 'text', value, onChange, placeholder, error, ...props }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
    <div className="relative">
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 transition-all ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 dark:border-slate-700'}`} {...props} />
      {error && <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />}
    </div>
    {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
    <textarea value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 h-24 resize-none transition-all" />
  </div>
);

const ToggleSwitch = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)} className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none ${checked ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const ReviewRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0">
    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
    <span className={`text-sm font-bold ${highlight ? 'text-teal-600' : 'text-slate-900 dark:text-white'} capitalize`}>{value || '-'}</span>
  </div>
);

export default AddPet;