import React from 'react'

const Navbar = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="px-20 py-4 bg-linear-to-r from-blue-500/15 to-purple-600/80 backdrop-blur-md flex items-center sticky top-0 z-50">
      
      <h1
        onClick={() => scrollToSection("home")}
        className="text-3xl font-serif font-bold text-slate-900 cursor-pointer"
      >
        Smart PetCare
      </h1>

      <nav className="ml-auto flex gap-10 text-lg font-semibold text-slate-800 font-serif">
        <span onClick={() => scrollToSection("home")} className="cursor-pointer hover:text-[rgb(232,225,225)] transition-colors duration-300">Home</span>
        <span onClick={() => scrollToSection("about")} className="cursor-pointer hover: hover:text-[rgb(232,225,225)] transition-colors duration-300 ">About</span>
        <span onClick={() => scrollToSection("contact")} className="cursor-pointer hover:hover:text-[rgb(232,225,225)] transition-colors duration-300 ">Contact</span>
        <span className='hover:hover:text-[rgb(232,225,225)] transition-colors duration-300'><a href='#'>SignUp</a></span>
        <button
  className="
    px-2 mx-[-5] rounded-full
    text-slate-800 font-semibold
    hover:bg-purple-100 hover:text-purple-700
    transition-all duration-300
  "
>
  Login
</button>
        
      </nav>
    </header>
  );
};

export default Navbar;
