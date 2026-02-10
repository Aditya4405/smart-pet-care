import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar'; // 👈 IMPORTED NAVBAR

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Toggle between Login and Signup based on URL or state
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [userType, setUserType] = useState('user'); // 'user' or 'vet'

  // Form Data State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: '',
    clinicName: '',
    specialization: '',
    yearsExperience: '',
    licenseNumber: '',
    certificate: null, // For file upload
  });

  // Error State
  const [errors, setErrors] = useState({});

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'certificate') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validation Logic
  const validateForm = () => {
    const newErrors = {};

    // Common Fields
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (!isLogin) {
      // Signup Specifics
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Vet Specifics
      if (userType === 'vet') {
        if (!formData.clinicName) newErrors.clinicName = 'Clinic name is required';
        if (!formData.specialization) newErrors.specialization = 'Specialization is required';
        if (!formData.yearsExperience) newErrors.yearsExperience = 'Experience is required';
        if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
        if (!formData.certificate) newErrors.certificate = 'Certificate upload is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Proceed with Form Submission (API Call)
      console.log('Form Submitted:', formData);
      alert('Success! Form is valid.');
      // navigate('/dashboard'); // Redirect on success
    } else {
        // Find the first error field and focus or just alert
        const firstErrorField = document.querySelector('[aria-invalid="true"]');
        if (firstErrorField) firstErrorField.focus();
    }
  };
  
   // Helper to switch modes
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({}); // Clear errors on toggle
    navigate(isLogin ? '/signup' : '/login');
  };

  // Icons
  const UserIcon = ( <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
  const VetIcon = ( <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300 pt-24">
      
      {/* 🔹 NAVBAR ADDED HERE 🔹 */}
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-full max-w-xl p-8 relative overflow-hidden border border-gray-100 dark:border-gray-700">
          
          {/* Top Right Toggle */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-full flex text-xs sm:text-sm font-semibold">
            <button
              onClick={() => { setIsLogin(false); navigate('/signup'); }}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${!isLogin ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            >
              Sign up
            </button>
            <button
              onClick={() => { setIsLogin(true); navigate('/login'); }}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${isLogin ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            >
              Sign in
            </button>
          </div>

          {/* Header Section */}
          <div className="mb-8 pr-32">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {isLogin ? 'Enter your details to access your account.' : 'Join 10,000+ pet parents today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button type="button" onClick={() => setUserType('user')} className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${userType === 'user' ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400' : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'}`}>
                  <div className={`p-2 rounded-full mb-2 transition-colors ${userType === 'user' ? 'bg-cyan-100 dark:bg-cyan-800' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200'}`}>{UserIcon}</div>
                  <span className="font-bold text-sm">Pet Owner</span>
                </button>
                <button type="button" onClick={() => setUserType('vet')} className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${userType === 'vet' ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400' : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'}`}>
                  <div className={`p-2 rounded-full mb-2 transition-colors ${userType === 'vet' ? 'bg-cyan-100 dark:bg-cyan-800' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200'}`}>{VetIcon}</div>
                  <span className="font-bold text-sm">Veterinarian</span>
                </button>
              </div>
            )}

            {isLogin ? (
              <>
                <InputField 
                    label="Email Address" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Enter your email" 
                    error={errors.email}
                />
                <InputField 
                    label="Password" 
                    name="password" 
                    type="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="••••••••" 
                    error={errors.password}
                />
                <div className="flex justify-end"><a href="#" className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold">Forgot Password?</a></div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" error={errors.firstName} />
                  <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" error={errors.lastName} />
                </div>
                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" error={errors.email} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone no" error={errors.phone} />
                  
                  {/* Gender Select with Error Handling */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Gender</label>
                    <div className="relative">
                      <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.gender ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-cyan-500'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer`}
                      >
                        <option value="" disabled>Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                    </div>
                    {errors.gender && <span className="text-xs text-red-500 ml-1">{errors.gender}</span>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" error={errors.password} />
                  <InputField label="Confirm" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" error={errors.confirmPassword} />
                </div>
                
                {/* VET FIELDS */}
                {userType === 'vet' && (
                  <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                     <div className="flex items-center gap-2 mb-4"><span className="w-8 h-px bg-gray-200 dark:bg-gray-600"></span><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Professional Verification</span><span className="flex-grow h-px bg-gray-200 dark:bg-gray-600"></span></div>
                     <div className="space-y-4">
                       <InputField label="Clinic Name" name="clinicName" value={formData.clinicName} onChange={handleChange} placeholder="Happy Paws Clinic" error={errors.clinicName} />
                       <div className="grid grid-cols-2 gap-4">
                           <InputField label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Surgery" error={errors.specialization} />
                           <InputField label="Years Exp." name="yearsExperience" type="number" value={formData.yearsExperience} onChange={handleChange} placeholder="5" error={errors.yearsExperience} />
                       </div>
                       <InputField label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="VET-12345678" error={errors.licenseNumber} />
                       
                       {/* 🔹 NEW: CERTIFICATE UPLOAD 🔹 */}
                       <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Upload Certificate</label>
                          <div className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${errors.certificate ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-cyan-500 bg-gray-50 dark:bg-gray-700'}`}>
                            
                            <input 
                                type="file" 
                                name="certificate" 
                                onChange={handleChange}
                                accept=".pdf,.jpg,.png"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            
                            <div className="pointer-events-none">
                                {formData.certificate ? (
                                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-medium">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="text-sm truncate max-w-[200px]">{formData.certificate.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                        <span className="text-xs font-bold">Click to upload</span>
                                        <span className="text-[10px] opacity-70">PDF, JPG or PNG</span>
                                    </div>
                                )}
                            </div>
                          </div>
                          {errors.certificate && <span className="text-xs text-red-500 ml-1">{errors.certificate}</span>}
                       </div>

                     </div>
                  </div>
                )}
              </>
            )}

            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={toggleMode} className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline transition-all">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated InputField to handle errors and props correctly
const InputField = ({ label, name, type = "text", value, onChange, placeholder, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{label}</label>
    <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder} 
        aria-invalid={!!error}
        className={`
            w-full px-4 py-3 rounded-xl border 
            ${error ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-cyan-500/20 focus:border-cyan-500'}
            bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 
            transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500
        `} 
    />
    {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
  </div>
);

export default SignUp;