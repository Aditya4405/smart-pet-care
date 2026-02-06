import vet from "../assets/vet.png";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";

const Landing = () => {
  const HealthIcon = (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h4l3 8 4-16 3 8h4" />
    </svg>
  );

  const AppointmentIcon = (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10" />
    </svg>
  );

  const MarketIcon = (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18l-2 13H5L3 3z" />
    </svg>
  );

  return (
    <div className="bg-white">

      {/* Header */}
       <Navbar />
       {/* ================= HOME / HERO SECTION ================= */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-6"
      >
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Image */}
          <div className="flex justify-center">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <img
                src={vet}
                alt="Smart Pet Care"
                className="w-[450px]"
              />
            </div>
          </div>

          {/* Right Content */}
          <div>
            <span className="text-xs tracking-widest text-gray-500 font-semibold">
              SMART PET CARE
            </span>

            <h1 className="text-5xl font-extrabold text-slate-900 mt-4 leading-tight">
              SmartPetCare <br />
              Your Pet’s Health Hub
            </h1>

            <p className="text-gray-600 mt-6 max-w-xl leading-relaxed">
              Manage your pet’s health, appointments, vaccinations, and get expert
              recommendations — all in one intelligent platform built for modern
              pet parents.
            </p>

           

            {/* Stats */}
            <div className="flex gap-16 mt-14">
              <div>
                <h3 className="text-2xl font-bold">10K+</h3>
                <p className="text-sm text-gray-500">Pet Owners</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold">500+</h3>
                <p className="text-sm text-gray-500">Veterinarians</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold">24/7</h3>
                <p className="text-sm text-gray-500">Care Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="px-20 py-24 bg-gray-50"
      >
        {/* About Heading */}
        <h2 className="text-4xl font-bold text-slate-900 text-center mb-6">
          About SmartPetCare
        </h2>

        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-16">
          SmartPetCare is designed to simplify pet healthcare by combining tracking,
          appointments, and trusted services into one seamless platform.
        </p>

        {/* FEATURE CARDS (INSIDE ABOUT) */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={HealthIcon}
            title="Health Tracking"
            description="Monitor your pet’s health status, track activities, and receive timely alerts to ensure proactive care."
          />

          <FeatureCard
            icon={AppointmentIcon}
            title="Appointments"
            description="Schedule and manage vet appointments with timely reminders so you never miss important visits."
          />

          <FeatureCard
            icon={MarketIcon}
            title="Marketplace"
            description="Access trusted pet products, medicines, and services through a secure marketplace."
          />
        </div>
      </section>

      {/* ================= CONTACT ================= */}
   <section
  id="contact"
  className="
    relative px-20 py-20
    bg-[#faf7ff]
  "
>
  {/* Top Gradient Line */}
  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500" />

  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div>
      <h3 className="text-3xl font-semibold text-slate-900 mb-4">
        Need help with SmartPetCare?
      </h3>
      <p className="text-gray-600 max-w-md">
        Have a question or need support? Our team is happy to assist you anytime.
      </p>
    </div>

    <div className="flex gap-6 justify-start md:justify-end">
      <button className="px-6 py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition">
        Email Us
      </button>

      <button className="px-6 py-3 rounded-full border border-purple-300 text-purple-700 font-medium hover:bg-purple-100 transition">
        Call Support
      </button>
    </div>
  </div>
</section>



    </div>
  );
};

export default Landing;
