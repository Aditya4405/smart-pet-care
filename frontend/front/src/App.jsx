import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// ================= LAYOUTS =================
import AdminLayout from './layouts/AdminLayout'; 
import VetLayout from './layouts/VetLayout';     
import SaaSLayout from './layouts/SaaSLayout';   

// ================= PUBLIC PAGES =================
import Landing from './pages/Landing'; 
import SignUp from './pages/SignUp'; 

// ================= ADMIN PAGES =================
import AdminDashboard from './pages/admin/Dashboard'; 
import Users from './pages/admin/Users';          
import DoctorList from './pages/admin/DoctorList';    
import AdminAppointments from './pages/admin/Appointments';
import AdminFinancials from './pages/admin/Financials';
import AdminAnalytics from './pages/admin/Analytics';
import AdminModeration from './pages/admin/Moderation';
import AdminSupport from './pages/admin/Support';
import AdminAuditLogs from './pages/admin/AuditLogs';
import AdminSettings from './pages/admin/Settings';

// ================= OWNER PAGES =================
import OwnerDashboard from './pages/owner/Dashboard';
import FindVet from './pages/owner/FindVet';    
import MyPets from './pages/owner/MyPets';
import AddPet from './pages/owner/AddPet';             
import Appointments from './pages/owner/Appointments';
import BookAppointment from './pages/owner/BookAppointment'; 
import HealthRecords from './pages/owner/HealthRecords';
import Payments from './pages/owner/Payments';
import Settings from './pages/owner/Settings';
import Profile from './pages/Profile'; 
import ContactSupport from './pages/owner/ContactSupport';

// ================= VET PAGES =================
import VetDashboard from './pages/vet/Dashboard';     
import VetSchedule from './pages/vet/Schedule';       
import VetPatients from './pages/vet/Patients';
import VetAnalytics from './pages/vet/Analytics';
import VetSettings from './pages/vet/Settings';

// ================= SHARED PAGES =================
import Marketplace from './pages/Marketplace'; 
import VideoRoom from './pages/VideoRoom'; 

// 🔒 ROLE GUARD
const RoleRoute = ({ children, allowedRoles }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!user) return <Navigate to="/login" replace />;

  const userRole = user.role ? user.role.toUpperCase() : 'USER';

  if (!allowedRoles.includes(userRole)) {
    if (userRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (userRole === 'VET') return <Navigate to="/vet/dashboard" replace />;
    return <Navigate to="/owner/dashboard" replace />;
  }
  return children;
};

// 🚧 UNDER CONSTRUCTION
const UnderConstruction = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-4xl mb-4">🚧</div>
    <h2 className="text-2xl font-bold text-slate-900">{title || "Coming Soon"}</h2>
    <p className="text-slate-500 mt-2 max-w-md">This enterprise module is currently being built.</p>
  </div>
);

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Router>
        <Routes>
          
          <Route path="/" element={<Landing />} /> 
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignUp />} />

          {/* ================= ADMIN ROUTES (SaaS Command Center) ================= */}
          <Route path="/admin" element={
              <RoleRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </RoleRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            
            <Route path="users" element={<Users />} />
            <Route path="doctors" element={<DoctorList />} />
            <Route path="marketplace" element={<Marketplace />} /> 
            
            {/* EXACT RELATIVE PATHS */}
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="financials" element={<AdminFinancials />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="moderation" element={<AdminModeration />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* ================= VET ROUTES ================= */}
          <Route path="/vet" element={<RoleRoute allowedRoles={['VET']}><VetLayout /></RoleRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<VetDashboard />} />
            <Route path="schedule" element={<VetSchedule />} />
            <Route path="patients" element={<VetPatients />} />
            <Route path="marketplace" element={<Marketplace />} /> 
            <Route path="analytics" element={<VetAnalytics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<VetSettings />} />
          </Route>

          {/* ================= OWNER ROUTES ================= */}
          <Route path="/owner" element={<RoleRoute allowedRoles={['USER']}><SaaSLayout /></RoleRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="doctors" element={<FindVet />} /> 
            <Route path="pets" element={<MyPets />} />
            <Route path="pets/add" element={<AddPet />} /> 
            <Route path="appointments" element={<Appointments />} />
            <Route path="appointments/book" element={<BookAppointment />} /> 
            <Route path="video-room" element={<VideoRoom />} />
            <Route path="health" element={<HealthRecords />} />
            <Route path="marketplace" element={<Marketplace />} /> 
            <Route path="payments" element={<Payments />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="support" element={<ContactSupport />} />
          </Route>

          {/* ================= DEBUGGING 404 CATCH ALL ================= */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
              <h1 className="text-4xl font-bold text-red-500 mb-4">404 Route Error</h1>
              <p className="text-slate-700 text-lg">React Router could not find this URL.</p>
              <p className="text-slate-500 mt-2 font-mono">Check your browser URL bar. Is it spelled exactly right?</p>
              <a href="/admin/dashboard" className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg">Go Back to Dashboard</a>
            </div>
          } />

        </Routes>
      </Router>
    </>
  );
}

export default App;