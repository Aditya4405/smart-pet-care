import vet from "../assets/vet.png"
import Navbar from "../components/Navbar";
const Landing = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* Header */}
       <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Image */}
          <div className="flex justify-center">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <img
                src={vet}
                alt="Smart Pet Care"
                className="w-[105]"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="ml-2">
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

            {/* Buttons */}
            <div className="flex items-center gap-6 mt-10">
              <div className="border border-blue-300 text-blue-700 px-8 py-3 rounded-full font-medium hover:bg-blue-100 transition"> Join Now</div>
            </div>

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
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        © 2026 SmartPetCare. All rights reserved.
      </footer>

    </div>
  );
};

export default Landing;
