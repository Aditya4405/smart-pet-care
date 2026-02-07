import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // IMPORTED
import Navbar from '../components/Navbar';

const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // LOGIC: If path is '/login', default to true. Else false.
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [userType, setUserType] = useState('user');

  // Sync state if the URL changes (e.g., user clicks Navbar buttons while already on the page)
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  // Helper to switch modes via URL
  const toggleMode = () => {
    if (isLogin) {
      navigate('/signUp');
    } else {
      navigate('/login');
    }
  };

  const UserIcon = ( <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
  const VetIcon = ( <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> );

  return (
    // ADDED pt-24 here so Navbar doesn't cover the form
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300 pt-24">
      
      {/* NAVBAR INCLUDED */}
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-full max-w-xl p-8 relative overflow-hidden border border-gray-100 dark:border-gray-700">
          
          {/* Top Right Toggle */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-full flex text-xs sm:text-sm font-semibold">
            <button
              onClick={() => navigate('/signUp')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${!isLogin ? 'bg-blue-400 dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            >
              Sign up
            </button>
            <button
              onClick={() => navigate('/login')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${isLogin ? 'bg-blue-400 dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
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
              {isLogin ? 'Enter your details to access your account.' : 'Connect with the best care for your pet.'}
            </p>
          </div>

          <form className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* ... (Role Buttons Code is same as before) ... */}
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
                <InputField label="Email Address" type="email" placeholder="Enter your email" />
                <InputField label="Password" type="password" placeholder="••••••••" />
                <div className="flex justify-end"><a href="#" className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold">Forgot Password?</a></div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="First Name" type="text" placeholder="First Name" />
                  <InputField label="Last Name" type="text" placeholder="Last Name" />
                </div>
                <InputField label="Email Address" type="email" placeholder="Enter your email" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Phone Number" type="tel" placeholder="Enter phone no" />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Gender</label>
                    <div className="relative">
                      <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all appearance-none cursor-pointer">
                        <option value="" disabled selected>Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Password" type="password" placeholder="••••••••" />
                  <InputField label="Confirm Password" type="password" placeholder="••••••••" />
                </div>
                {userType === 'vet' && (
                  <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                     <div className="flex items-center gap-2 mb-4"><span className="w-8 h-px bg-gray-200 dark:bg-gray-600"></span><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Professional Verification</span><span className="flex-grow h-px bg-gray-200 dark:bg-gray-600"></span></div>
                     <div className="space-y-4">
                       <InputField label="Clinic Name" type="text" placeholder="Happy Paws Clinic" />
                       <div className="grid grid-cols-2 gap-4"><InputField label="Specialization" type="text" placeholder="e.g. Surgery" /><InputField label="Years Exp." type="number" placeholder="5" /></div>
                       <InputField label="License Number" type="text" placeholder="VET-12345678" />
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

const InputField = ({ label, type, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{label}</label>
    <input type={type} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" />
  </div>
);

export default SignUp;