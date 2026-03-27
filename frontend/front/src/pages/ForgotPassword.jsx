import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import { Mail, ArrowLeft } from 'lucide-react';
import { API } from "../config/api";
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API.BASE_API}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        toast.success("Reset link sent to your email 📩");
        setEmail('');
      } else {
        const err = await res.text();
        toast.error(err || "Something went wrong");
      }

    } catch (error) {
      console.error(error);
      toast.error("Server not reachable");
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
              Forgot Password
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-70"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* BACK TO LOGIN */}
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

export default ForgotPassword;