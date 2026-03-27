import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import { ShieldCheck, User, Users, Eye, EyeOff } from 'lucide-react';
import { API } from "../config/api";
import toast from 'react-hot-toast';

const SignUp = () => {
  const navigate = useNavigate();
  const locationPath = useLocation();

  // State
  const [isLogin, setIsLogin] = useState(locationPath.pathname === '/login');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [userType, setUserType] = useState('user'); 
  
  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Listen for URL changes
  useEffect(() => {
    setIsLogin(locationPath.pathname === '/login');
    setErrors({});
    setIsAdminLogin(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [locationPath.pathname]);

  // Form Data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: '',
    // Vet Specific
    clinicName: '',
    location: '', // <--- NEW LOCATION FIELD
    specialization: '',
    yearsExperience: '',
    licenseNumber: '',
    certificate: null, 
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'certificate') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mismatch';
      
      if (userType === 'vet') {
         if (!formData.clinicName) newErrors.clinicName = 'Clinic Name required';
         if (!formData.location) newErrors.location = 'Location required'; // <--- VALIDATION ADDED
         if (!formData.licenseNumber) newErrors.licenseNumber = 'License required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        const firstErrorField = document.querySelector('[aria-invalid="true"]');
        if (firstErrorField) firstErrorField.focus();
        return;
    }

    setIsLoading(true);
    const endpoint = isLogin ? '/login' : '/register';
    const url = `${API.BASE_API}/users${endpoint}`;

    try {
        let body;
        let headers = {};

        if (isLogin) {
            body = JSON.stringify({ email: formData.email, password: formData.password });
            headers = { 'Content-Type': 'application/json' };
        } else {
            const dataPayload = { ...formData };
            dataPayload.role = userType === 'vet' ? 'VET' : 'USER';
            delete dataPayload.confirmPassword;
            delete dataPayload.certificate; 

            const formDataPacket = new FormData();
            formDataPacket.append("user", JSON.stringify(dataPayload));
            
            if (formData.certificate) {
                formDataPacket.append("certificate", formData.certificate);
            }
            body = formDataPacket;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (response.ok) {
            const userData = await response.json();
            
            if (isLogin) {
                const normalizedRole = userData.role ? userData.role.toUpperCase() : 'USER';
                
                if (!isAdminLogin && normalizedRole === 'ADMIN') {
                    toast.error("Account mismatch: Please switch to 'Admin Login'.");
                    setIsLoading(false);
                    return; 
                }

                if (isAdminLogin && normalizedRole !== 'ADMIN') {
                    toast.error("Access Denied: Administrator privileges required.");
                    setIsLoading(false);
                    return; 
                }

                const finalUser = { ...userData, role: normalizedRole };
                localStorage.setItem('user', JSON.stringify(finalUser));
                localStorage.setItem('token', userData.token); 
                
                toast.success("Login Successful!");
                
                if (normalizedRole === 'ADMIN') navigate('/admin/dashboard');
                else if (normalizedRole === 'VET') navigate('/vet/dashboard');
                else navigate('/owner/dashboard');

            } else {
                if (userType === 'vet') {
                    toast.success("Registration Request Sent! Please wait for Admin Approval.", { duration: 5000 });
                } else {
                    toast.success("Account Created Successfully! Please Sign In.");
                }
                navigate('/login');
            }
        } else {
            const errorMsg = await response.text();
            toast.error("Error: " + errorMsg);
        }

    } catch (error) {
        console.error("Error:", error);
        toast.error("Connection Failed. Is Backend running?");
    } finally {
        setIsLoading(false);
    }
  };

  const PasswordToggleBtn = ({ isVisible, onToggle }) => (
    <button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none" tabIndex="-1">
      {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300 pt-24">
      <PublicNavbar /> 
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-full max-w-xl p-8 relative overflow-hidden border border-slate-100 dark:border-slate-700">
          
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-slate-100 dark:bg-slate-700 p-1 rounded-full flex text-xs sm:text-sm font-semibold">
            <button onClick={() => navigate('/signup')} className={`px-4 py-1.5 rounded-full transition-all duration-200 ${!isLogin ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>Sign up</button>
            <button onClick={() => navigate('/login')} className={`px-4 py-1.5 rounded-full transition-all duration-200 ${isLogin ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>Sign in</button>
          </div>

          <div className="mb-8 pr-32">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                {isAdminLogin ? 'Admin Portal' : (isLogin ? 'Welcome back' : 'Create account')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
                {isAdminLogin ? 'Secure access for system administrators.' : (isLogin ? 'Enter your details to access your account.' : 'Join 10,000+ pet parents today.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isLogin && (
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <button type="button" onClick={() => setIsAdminLogin(false)} className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 font-bold text-sm ${!isAdminLogin ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400'}`}>
                        <User className="w-4 h-4" /> User Login
                    </button>
                    <button type="button" onClick={() => setIsAdminLogin(true)} className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 font-bold text-sm ${isAdminLogin ? 'border-slate-800 bg-slate-100 text-slate-800 dark:border-slate-500 dark:bg-slate-800 dark:text-white' : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400'}`}>
                        <ShieldCheck className="w-4 h-4" /> Admin Login
                    </button>
                </div>
            )}

            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button type="button" onClick={() => setUserType('user')} className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${userType === 'user' ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400' : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 dark:text-slate-400'}`}>
                  <div className={`p-2 rounded-full mb-2 transition-colors ${userType === 'user' ? 'bg-teal-100 dark:bg-teal-800' : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200'}`}><Users className="w-6 h-6" /></div>
                  <span className="font-bold text-sm">Pet Owner</span>
                </button>
                <button type="button" onClick={() => setUserType('vet')} className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${userType === 'vet' ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400' : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 dark:text-slate-400'}`}>
                  <div className={`p-2 rounded-full mb-2 transition-colors ${userType === 'vet' ? 'bg-teal-100 dark:bg-teal-800' : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200'}`}><ShieldCheck className="w-6 h-6" /></div>
                  <span className="font-bold text-sm">Veterinarian</span>
                </button>
              </div>
            )}

            {isLogin ? (
              <>
                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder={isAdminLogin ? "Enter Admin Email " : "Enter your email"} error={errors.email} />
                <InputField 
  label="Password" 
  name="password" 
  type={showPassword ? "text" : "password"} 
  value={formData.password} 
  onChange={handleChange} 
  placeholder="••••••••" 
  error={errors.password} 
  endAdornment={
    <PasswordToggleBtn 
      isVisible={showPassword} 
      onToggle={() => setShowPassword(!showPassword)} 
    />
  } 
/>

{/* 🔐 FORGOT PASSWORD LINK */}
<div className="flex justify-end mt-1">
  <button
    type="button"
    onClick={() => navigate('/forgot-password')}
    className="text-xs font-semibold text-teal-500 hover:text-teal-600 hover:underline transition-colors"
  >
    Forgot Password?
  </button>
</div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" error={errors.firstName} />
                  <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" error={errors.lastName} />
                </div>
                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" error={errors.email} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Enter Phone No" error={errors.phone} />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Gender</label>
                    <div className="relative">
                      <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${errors.gender ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white appearance-none`}>
                        <option value="" disabled>Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="••••••••" error={errors.password} endAdornment={<PasswordToggleBtn isVisible={showPassword} onToggle={() => setShowPassword(!showPassword)} />} />
                  <InputField label="Confirm" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" error={errors.confirmPassword} endAdornment={<PasswordToggleBtn isVisible={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />} />
                </div>
                
                {userType === 'vet' && (
                  <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-700 animate-fadeIn">
                      <div className="space-y-4">
                        
                        {/* --- NEW GRID FOR CLINIC & LOCATION --- */}
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Clinic Name" name="clinicName" value={formData.clinicName} onChange={handleChange} placeholder="Happy Paws Clinic" error={errors.clinicName} />
                            <InputField label="City / Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Mumbai, India" error={errors.location} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Surgery" error={errors.specialization} />
                            <InputField label="Years Exp." name="yearsExperience" type="number" value={formData.yearsExperience} onChange={handleChange} placeholder="5" error={errors.yearsExperience} />
                        </div>
                        <InputField label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="VET-12345678" error={errors.licenseNumber} />
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Upload Certificate</label>
                          <div className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${errors.certificate ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-teal-500 bg-slate-50 dark:bg-slate-700'}`}>
                            <input type="file" name="certificate" onChange={handleChange} accept=".pdf,.jpg,.png" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="pointer-events-none">
                                {formData.certificate ? (
                                    <span className="text-teal-600 font-medium truncate max-w-[200px]">{formData.certificate.name}</span>
                                ) : (
                                    <span className="text-xs font-bold text-slate-500">Click to upload (PDF/JPG)</span>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                )}
              </>
            )}

            <button disabled={isLoading} type="submit" className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mt-2 disabled:opacity-70 ${isAdminLogin ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-500/30' : 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/30'}`}>
              {isLoading ? 'Processing...' : (isAdminLogin ? 'Access Admin Portal' : (isLogin ? 'Sign In' : 'Create Account'))}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={() => navigate(isLogin ? '/signup' : '/login')} className="font-bold text-teal-600 hover:underline">
                {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange, placeholder, error, endAdornment }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{label}</label>
    <div className="relative">
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} aria-invalid={!!error} className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${endAdornment ? 'pr-10' : ''}`} />
        {endAdornment}
    </div>
    {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
  </div>
);

export default SignUp;