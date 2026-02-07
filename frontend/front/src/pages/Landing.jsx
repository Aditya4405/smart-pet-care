import React from 'react';
import vet from "../assets/vet.png";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";

// Icons for the footer (defined here to keep code clean)
const FooterIcons = {
  Email: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  Phone: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
  ),
  Map: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  )
};

const Icons = {
  Health: (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>),
  Calendar: (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>),
  Shop: (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>)
};

const Landing = () => {
  return (
    <div className="min-h-screen font-sans transition-colors duration-300 bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 selection:bg-cyan-100 selection:text-cyan-900">
      
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section id="home" className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[100px] opacity-0 dark:opacity-40"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] opacity-0 dark:opacity-40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hero Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wide mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                #1 Pet Health Platform
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.15] mb-6">
                Smart care for your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                  best friend.
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg">
                Manage appointments, track vaccinations, and get expert vet advice in one intelligent dashboard.
              </p>
           
              {/* Stats */}
              <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-8">
                {[
                  { label: "Pet Owners", val: "10K+" },
                  { label: "Veterinarians", val: "500+" },
                  { label: "Support", val: "24/7" },
                ].map((stat, idx) => (
                  <div key={idx}>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.val}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-gray-200 dark:ring-white/10 dark:bg-white transform hover:scale-[1.01] transition-transform duration-500">
                <img src={vet} alt="Dashboard Preview" className="w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-3xl mx-auto text-center px-6 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything your pet needs.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            We’ve combined health tracking, professional care, and a marketplace into one seamless experience.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={Icons.Health} title="Health Monitoring" description="Track weight, diet, and activity levels daily. Get alerts when something looks off." />
          <FeatureCard icon={Icons.Calendar} title="Smart Scheduling" description="Book vet visits instantly and get automated reminders for vaccinations." />
          <FeatureCard icon={Icons.Shop} title="Curated Marketplace" description="Shop for vet-approved foods, toys, and medicines with 2-day delivery." />
        </div>
      </section>

      {/* ================= CTA / CONTACT CARD ================= */}
      <section id="contact" className="py-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-gray-900 dark:bg-gray-800 rounded-3xl p-8 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold mb-6">Ready to upgrade your pet parenting?</h3>
              <p className="text-gray-300 mb-10 text-lg">
                Join 10,000+ happy pet owners today. Sign up is free and takes less than 2 minutes.
              </p>
              <div className="flex justify-center gap-4">
                 <button className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1">
                   Get Started Now
                 </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-16">
            
            {/* Left Side: Contact Support */}
            <div className="space-y-6">
               <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">SmartPetCare</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                    Making pet parenting easier, smarter, and more connected for everyone.
                  </p>
               </div>
               
               <div className="space-y-4">
                 <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Contact Support</h4>
                 <ul className="space-y-3">
                   <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">
                     <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-cyan-600 dark:text-cyan-400">
                       {FooterIcons.Email}
                     </div>
                     <span className="font-medium">support@smartpetcare.com</span>
                   </li>
                   <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">
                     <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-cyan-600 dark:text-cyan-400">
                       {FooterIcons.Phone}
                     </div>
                     <span className="font-medium">+91 6521360153</span>
                   </li>
                   <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                     <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-cyan-600 dark:text-cyan-400">
                       {FooterIcons.Map}
                     </div>
                     <span className="font-medium">Kanpur,India</span>
                   </li>
                 </ul>
               </div>
            </div>

            {/* Right Side: Services Links */}
            <div className="md:pl-10">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Our Services</h3>
               <ul className="space-y-4">
                 {['Health Monitoring', 'Vet Appointments', 'Vaccination Tracking', 'Pet Marketplace', '24/7 Expert Support', 'Emergency Care'].map((service) => (
                   <li key={service}>
                     <a href="#" className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                       <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-cyan-500 transition-colors"></span>
                       {service}
                     </a>
                   </li>
                 ))}
               </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Legal */}
          <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-sm text-gray-500 dark:text-gray-400">
               © 2026 SmartPetCare Inc. All rights reserved.
             </p>
             <div className="flex gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
               <a href="#" className="hover:text-cyan-600 dark:hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-cyan-600 dark:hover:text-white transition-colors">Terms of Service</a>
               <a href="#" className="hover:text-cyan-600 dark:hover:text-white transition-colors">Cookie Policy</a>
             </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Landing;