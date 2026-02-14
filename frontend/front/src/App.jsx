import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- LAYOUTS ---
import AdminLayout from './layouts/AdminLayout';
import OwnerLayout from './layouts/OwnerLayout';
// import VetLayout from './layouts/VetLayout'; // Create this later if needed

// --- PUBLIC PAGES ---
import Landing from './pages/Landing'; 
import SignUp from './pages/SignUp'; 

// --- ADMIN PAGES ---
import AdminDashboard from './pages/admin/Dashboard';
import DoctorList from './pages/admin/DoctorList';

// --- OWNER PAGES ---
import OwnerDashboard from './pages/owner/Dashboard';
import MyPets from './pages/owner/MyPets';
import Appointments from './pages/owner/Appointments';
import HealthRecords from './pages/owner/HealthRecords';
import Marketplace from './pages/owner/Marketplace';
import Payments from './pages/owner/Payments';
import Settings from './pages/owner/Settings';

// 🔒 ROLE GUARD COMPONENT
const RoleRoute = ({ children, allowedRoles }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    // Redirect if they try to access a page not for their role
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'VET') return <Navigate to="/vet/dashboard" replace />;
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

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </RoleRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<DoctorList />} />
        </Route>

        {/* ================= OWNER ROUTES ================= */}
        <Route path="/owner" element={
            <RoleRoute allowedRoles={['USER']}>
              <OwnerLayout />
            </RoleRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="pets" element={<MyPets />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="health" element={<HealthRecords />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ================= 404 CATCH ALL ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;