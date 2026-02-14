import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar'; 
import { ShieldCheck, User, Users } from 'lucide-react'; // Added Icons

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [isAdminLogin, setIsAdminLogin] = useState(false); // Default to User Login
  const [userType, setUserType] = useState('user'); // For Signup (Pet Owner vs Vet)

  // Listen for URL changes
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
    setErrors({});
    setIsAdminLogin(false); // Reset to user login on navigation
  }, [location.pathname]);

  // Form Data
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
         if (!formData.licenseNumber) newErrors.licenseNumber = 'License required';
         if (!formData.certificate) newErrors.certificate = 'Certificate file is required';
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

    const endpoint = isLogin ? '/login' : '/register';
    const url = `http://localhost:8082/api/users${endpoint}`;

    try {
        let body;
        let headers = {};

        if (isLogin) {
            // LOGIN
            body = JSON.stringify({ email: formData.email, password: formData.password });
            headers = { 'Content-Type': 'application/json' };
        } else {
            // REGISTER
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
                // --- LOGIN SUCCESS LOGIC ---
                const role = userData.role ? userData.role.toUpperCase() : 'USER';

                // 🛑 STRICT ADMIN CHECK
                if (isAdminLogin && role !== 'ADMIN') {
                    alert("Access Denied: You are not an Administrator.");
                    return; 
                }
                // 🛑 STRICT USER CHECK (Prevent Admins from logging in as Users if you want)
                // Optional: if (!isAdminLogin && role === 'ADMIN') { alert("Please use Admin Login."); return; }

                localStorage.setItem('user', JSON.stringify(userData));
                
                // Redirect based on Role
                if (role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else if (role === 'VET') {
                    navigate('/vet/dashboard');
                } else {
                    navigate('/owner/dashboard');
                }

            } else {
                // --- REGISTRATION SUCCESS LOGIC ---
                if (userType === 'vet') {
                    alert("Registration Request Sent! Please wait for Admin Approval.");
                } else {
                    alert("Account Created Successfully! Please Login.");
                }
                navigate('/login');
            }

        } else {
            const errorMsg = await response.text();
            alert("Error: " + errorMsg);
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Connection Failed. Is Backend running?");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300 pt-24">
      
      <PublicNavbar /> 

      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-full max-w-xl p-8 relative overflow-hidden border border-gray-100 dark:border-gray-700">
          
          {/* Top Right Toggle (Sign Up / Sign In) */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-full flex text-xs sm:text-sm font-semibold">
            <button onClick={() => navigate('/signup')} className={`px-4 py-1.5 rounded-full transition-all duration-200 ${!isLogin ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Sign up</button>
            <button onClick={() => navigate('/login')} className={`px-4 py-1.5 rounded-full transition-all duration-200 ${isLogin ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Sign in</button>
          </div>

          <div className="mb-8 pr-32">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                {isAdminLogin ? 'Admin Portal' : (isLogin ? 'Welcome back' : 'Create account')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                {isAdminLogin ? 'Secure access for system administrators.' : (isLogin ? 'Enter your details to access your account.' : 'Join 10,000+ pet parents today.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* LOGIN MODE SWITCHER */}
            {isLogin && (
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <button 
                        type="button" 
                        onClick={() => setIsAdminLogin(false)}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 font-bold text-sm ${!isAdminLogin ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'}`}
                    >
                        <User className="w-4 h-4" /> User Login
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setIsAdminLogin(true)}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 font-bold text-sm ${isAdminLogin ? 'border-slate-800 bg-slate-100 text-slate-800 dark:border-slate-500 dark:bg-slate-800 dark:text-white' : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'}`}
                    >
                        <ShieldCheck className="w-4 h-4" /> Admin Login
                    </button>
                </div>
            )}

            {/* SIGNUP MODE SWITCHER */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button type="button" onClick={() => setUserType('user')} className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${userType === 'user' ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400' : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'}`}>
                  <div className={`p-2 rounded-full mb-2 transition-colors ${userType === 'user' ? 'bg-cyan-100 dark:bg-cyan-800' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200'}`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm">Pet Owner</span>
                </button>
                <button type="button" onClick={() => setUserType('vet')} className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${userType === 'vet' ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400' : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'}`}>
                  <div className={`p-2 rounded-full mb-2 transition-colors ${userType === 'vet' ? 'bg-cyan-100 dark:bg-cyan-800' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200'}`}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm">Veterinarian</span>
                </button>
              </div>
            )}

            {isLogin ? (
              <>
                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder={isAdminLogin ? "admin@smartpet.com" : "john@example.com"} error={errors.email} />
                <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" error={errors.password} />
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" error={errors.firstName} />
                  <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" error={errors.lastName} />
                </div>
                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" error={errors.email} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="(555) 000-0000" error={errors.phone} />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Gender</label>
                    <div className="relative">
                      <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${errors.gender ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none`}>
                        <option value="" disabled>Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" error={errors.password} />
                  <InputField label="Confirm" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" error={errors.confirmPassword} />
                </div>
                
                {userType === 'vet' && (
                  <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                      <div className="space-y-4">
                        <InputField label="Clinic Name" name="clinicName" value={formData.clinicName} onChange={handleChange} placeholder="Happy Paws Clinic" error={errors.clinicName} />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Surgery" error={errors.specialization} />
                            <InputField label="Years Exp." name="yearsExperience" type="number" value={formData.yearsExperience} onChange={handleChange} placeholder="5" error={errors.yearsExperience} />
                        </div>
                        <InputField label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="VET-12345678" error={errors.licenseNumber} />
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Upload Certificate</label>
                          <div className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${errors.certificate ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-cyan-500 bg-gray-50 dark:bg-gray-700'}`}>
                            <input type="file" name="certificate" onChange={handleChange} accept=".pdf,.jpg,.png" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="pointer-events-none">
                                {formData.certificate ? (
                                    <span className="text-cyan-600 font-medium truncate max-w-[200px]">{formData.certificate.name}</span>
                                ) : (
                                    <span className="text-xs font-bold text-gray-500">Click to upload (PDF/JPG)</span>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                )}
              </>
            )}

            {/* MAIN SUBMIT BUTTON */}
            <button 
                type="submit" 
                className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mt-2 
                ${isAdminLogin 
                    ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-500/30' 
                    : 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/30'
                }`}
            >
              {isAdminLogin ? 'Access Admin Portal' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-8 text-center">
            <button onClick={() => navigate(isLogin ? '/signup' : '/login')} className="font-bold text-cyan-600 hover:underline">
                {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange, placeholder, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} aria-invalid={!!error} className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20`} />
    {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
  </div>
);

export default SignUp;