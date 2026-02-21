import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ================= LAYOUTS =================
import AdminLayout from './layouts/AdminLayout'; // New Sidebar Layout
import VetLayout from './layouts/VetLayout';     // TopNav Layout (Vet)
import SaaSLayout from './layouts/SaaSLayout';   // TopNav Layout (Owner)

// ================= PUBLIC PAGES =================
import Landing from './pages/Landing'; 
import SignUp from './pages/SignUp'; 

// ================= ADMIN PAGES =================
import AdminDashboard from './pages/admin/Dashboard'; // Executive Overview
import Users from './pages/admin/Users';              // User Management (New)
import DoctorList from './pages/admin/DoctorList';    // Doctor Approvals

// ================= OWNER PAGES =================
import OwnerDashboard from './pages/owner/Dashboard';
import FindVet from './pages/owner/FindVet';          // Find a Vet Page
import MyPets from './pages/owner/MyPets';
import AddPet from './pages/owner/AddPet';             
import Appointments from './pages/owner/Appointments';
import BookAppointment from './pages/owner/BookAppointment'; 
import HealthRecords from './pages/owner/HealthRecords';
import Payments from './pages/owner/Payments';
import Settings from './pages/owner/Settings';
import Profile from './pages/Profile'; 


// ================= VET PAGES =================
import VetDashboard from './pages/vet/Dashboard';     
import VetSchedule from './pages/vet/Schedule';       
import VetPatients from './pages/vet/Patients';
import VetAnalytics from './pages/vet/Analytics';
import VetSettings from './pages/vet/Settings';

// ================= SHARED PAGES =================
import Marketplace from './pages/Marketplace'; 

import VideoRoom from './pages/VideoRoom'; // Shared page

// 🔒 ROLE GUARD COMPONENT
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

// 🚧 Placeholder for Admin Pages Under Construction
const UnderConstruction = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-4xl mb-4">🚧</div>
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title || "Coming Soon"}</h2>
    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
      This enterprise module is currently being built. Check back later for updates.
    </p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Landing />} /> 
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignUp />} />

        {/* ================= ADMIN ROUTES (SaaS Command Center) ================= */}
        <Route path="/admin" element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </RoleRoute>
        }>
          {/* 1. Dashboard & Core */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* 2. Management Modules */}
          <Route path="users" element={<Users />} />
          <Route path="doctors" element={<DoctorList />} />
          <Route path="marketplace" element={<Marketplace />} /> 
          
          {/* 3. Placeholders for Future Modules (Prevents 404s on Sidebar clicks) */}
          <Route path="appointments" element={<UnderConstruction title="Appointment Control Center" />} />
          <Route path="payments" element={<UnderConstruction title="Financial Reports" />} />
          <Route path="analytics" element={<UnderConstruction title="Deep Analytics" />} />
          <Route path="moderation" element={<UnderConstruction title="Content Moderation" />} />
          <Route path="support" element={<UnderConstruction title="Support Tickets" />} />
          <Route path="audit-logs" element={<UnderConstruction title="System Audit Logs" />} />
          <Route path="settings" element={<UnderConstruction title="Platform Settings" />} />
        </Route>

        {/* ================= VET ROUTES ================= */}
        <Route path="/vet" element={
            <RoleRoute allowedRoles={['VET']}>
              <VetLayout />
            </RoleRoute>
        }>
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
        <Route path="/owner" element={
            <RoleRoute allowedRoles={['USER']}>
              <SaaSLayout />
            </RoleRoute>
        }>
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
        </Route>

        {/* ================= 404 CATCH ALL ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;