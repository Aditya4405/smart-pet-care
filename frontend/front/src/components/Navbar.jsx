import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 SMART LOGIC: Check path
  const currentPath = location.pathname.toLowerCase().replace(/\/$/, ""); 
  const guestPaths = ["", "/", "/login", "/signup"];
  const isGuestPage = guestPaths.includes(currentPath);
  const isLoggedIn = !isGuestPage;
  const isProfilePage = currentPath === '/profile';

  // 1. Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Theme Logic
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
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
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Dynamic Styles
  const getNavbarStyles = () => {
    if (isProfilePage) {
       return isScrolled 
         ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm py-3' 
         : 'bg-transparent border-transparent py-5';
    }
    return isScrolled 
      ? 'bg-white/80 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-3 border-b border-gray-200 dark:border-gray-800' 
      : 'bg-white/40 dark:bg-gray-900/30 backdrop-blur-sm py-5 border-b border-white/20 dark:border-white/5';
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${getNavbarStyles()}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* LOGO */}
        <div onClick={() => navigate(isLoggedIn ? '/profile' : '/')} className="cursor-pointer flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md">S</div>
           <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            SmartPetCare
          </h1>
        </div>

        {/* 🔹 MIDDLE LINKS (ALWAYS VISIBLE NOW) */}
        <nav className="hidden md:flex items-center gap-8">
          {isLoggedIn ? (
            // === LOGGED IN LINKS ===
            <>
              {['Dashboard', 'My Pets', 'Appointments','Shop'].map((item) => (
                <button
                  key={item}
                  className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {item}
                </button>
              ))}
            </>
          ) : (
            // === GUEST LINKS ===
            <>
              {['Home', 'About', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {item}
                </button>
              ))}
            </>
          )}
        </nav>

        {/* 🔹 RIGHT SIDE ACTIONS */}
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

          {isLoggedIn ? (
            // === LOGGED IN: Avatar + Logout ===
            <div className="flex items-center gap-4 pl-2 border-l border-gray-200 dark:border-gray-700">
               <div className="flex items-center gap-3">
                  <div 
                    onClick={() => navigate('/profile')}
                    className="w-9 h-9 rounded-full bg-cyan-500 text-white font-bold flex items-center justify-center shadow-md cursor-pointer hover:ring-2 hover:ring-cyan-300 transition-all"
                  >
                    AP
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/10 hover:bg-red-100 transition-colors"
                  >
                    Logout
                  </button>
               </div>
            </div>
          ) : (
            // === GUEST: Login / Signup ===
            <>
              <button 
                onClick={() => navigate('/login')}
                className="group relative overflow-hidden rounded-full px-6 py-2 text-sm font-bold border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 transition-all hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <span className="absolute bottom-0 left-0 w-full h-0 bg-cyan-500 transition-all duration-300 ease-out group-hover:h-full"></span>
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Login</span>
              </button>

              <button 
                onClick={() => navigate('/signup')}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all"
              >
                Sign Up
              </button>
            </>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;