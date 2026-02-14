import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ================= LAYOUTS =================
import AdminLayout from './layouts/AdminLayout'; // Sidebar Layout
import VetLayout from './layouts/VetLayout';     // TopNav Layout (Vet)
import SaaSLayout from './layouts/SaaSLayout';   // TopNav Layout (Owner)

// ================= PUBLIC PAGES =================
import Landing from './pages/Landing'; 
import SignUp from './pages/SignUp'; 

// ================= ADMIN PAGES =================
import AdminDashboard from './pages/admin/Dashboard';
import DoctorList from './pages/admin/DoctorList';

// ================= OWNER PAGES =================
import OwnerDashboard from './pages/owner/Dashboard';
import MyPets from './pages/owner/MyPets';
import AddPet from './pages/owner/AddPet';             
import Appointments from './pages/owner/Appointments';
import BookAppointment from './pages/owner/BookAppointment'; 
import HealthRecords from './pages/owner/HealthRecords';
import OwnerMarketplace from './pages/owner/Marketplace';
import Payments from './pages/owner/Payments';
import Settings from './pages/owner/Settings';
import Profile from './pages/Profile'; 

// ================= VET PAGES =================
import VetDashboard from './pages/vet/Dashboard';     // The Main Visual Dashboard
import VetSchedule from './pages/vet/Schedule';       // The Schedule View
import VetPatients from './pages/vet/Patients';
import VetMarketplace from './pages/vet/Marketplace';
import VetAnalytics from './pages/vet/Analytics';

// 🔒 ROLE GUARD COMPONENT
const RoleRoute = ({ children, allowedRoles }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!user) return <Navigate to="/login" replace />;

  // CRITICAL FIX: Normalize role to Uppercase to prevent login loops
  const userRole = user.role ? user.role.toUpperCase() : 'USER';

  if (!allowedRoles.includes(userRole)) {
    // Redirect logic based on role if they try to access unauthorized pages
    if (userRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (userRole === 'VET') return <Navigate to="/vet/dashboard" replace />;
    return <Navigate to="/owner/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Landing />} /> 
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignUp />} />

        {/* ================= ADMIN ROUTES (Sidebar) ================= */}
        <Route path="/admin" element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </RoleRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<DoctorList />} />
        </Route>

        {/* ================= VET ROUTES (Top Navbar) ================= */}
        <Route path="/vet" element={
            <RoleRoute allowedRoles={['VET']}>
              <VetLayout />
            </RoleRoute>
        }>
          {/* 1. Default Redirect to Dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* 2. Main Visual Dashboard */}
          <Route path="dashboard" element={<VetDashboard />} />
          
          {/* 3. Schedule Page */}
          <Route path="schedule" element={<VetSchedule />} />
          
          <Route path="patients" element={<VetPatients />} />
          <Route path="marketplace" element={<VetMarketplace />} />
          <Route path="analytics" element={<VetAnalytics />} />
        </Route>

        {/* ================= OWNER ROUTES (Top Navbar) ================= */}
        <Route path="/owner" element={
            <RoleRoute allowedRoles={['USER']}>
              <SaaSLayout />
            </RoleRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
          
          {/* Pet Management */}
          <Route path="pets" element={<MyPets />} />
          <Route path="pets/add" element={<AddPet />} /> 

          {/* Appointments */}
          <Route path="appointments" element={<Appointments />} />
          <Route path="appointments/book" element={<BookAppointment />} /> 

          {/* Other Features */}
          <Route path="health" element={<HealthRecords />} />
          <Route path="marketplace" element={<OwnerMarketplace />} />
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