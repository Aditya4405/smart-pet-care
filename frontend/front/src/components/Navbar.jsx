import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // IMPORTED

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate(); // HOOK FOR NAVIGATION
  const location = useLocation(); // HOOK TO CHECK CURRENT PAGE

  // 1. Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Theme Initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const scrollToSection = (id) => {
    // If we are NOT on the home page, go there first
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 
        transition-all duration-300 ease-in-out
        ${isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-3 border-b border-gray-200 dark:border-gray-800' 
          : 'bg-white/40 dark:bg-gray-900/30 backdrop-blur-sm py-5 border-b border-white/20 dark:border-white/5'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* LOGO - Click goes Home */}
        <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md">S</div>
           <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            SmartPetCare
          </h1>
        </div>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          {['Home', 'About', 'Contact'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          {/* LOGIN BUTTON -> Navigate to /login */}
          <button 
            onClick={() => navigate('/login')}
            className="group relative overflow-hidden rounded-full px-6 py-2 text-sm font-bold border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 transition-all hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <span className="absolute bottom-0 left-0 w-full h-0 bg-cyan-500 transition-all duration-300 ease-out group-hover:h-full"></span>
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Login</span>
          </button>

          {/* SIGN UP BUTTON -> Navigate to /signup */}
          <button 
            onClick={() => navigate('/signup')}
            className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;