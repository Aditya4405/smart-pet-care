import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { API } from "../config/api";
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid or expired link");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API.BASE_API}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          password
        })
      });

      if (res.ok) {
        toast.success("Password reset successful 🎉");
        navigate('/login');
      } else {
        const err = await res.text();
        toast.error(err || "Reset failed");
      }

    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col pt-24 transition-colors duration-300">
      
      <PublicNavbar />

      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-full max-w-md p-8 border border-slate-100 dark:border-slate-700">
          
          {/* HEADER */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Reset Password
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Enter your new password below.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleReset} className="space-y-5">

            {/* NEW PASSWORD */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-70"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {/* BACK */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 text-sm font-bold text-teal-600 hover:underline mx-auto"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;