import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// ✅ IMPORT THE CART PROVIDER
import { CartProvider } from './context/CartContext'; 

// ================= LAYOUTS =================
import AdminLayout from './layouts/AdminLayout'; 
import VetLayout from './layouts/VetLayout';     
import SaaSLayout from './layouts/SaaSLayout';   

// ================= PUBLIC PAGES =================
import Landing from './pages/Landing'; 
import SignUp from './pages/SignUp'; 
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

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

// ================= VET PAGES =================
import VetDashboard from './pages/vet/Dashboard';     
import VetSchedule from './pages/vet/Schedule';       
import VetPatients from './pages/vet/Patients';
import VetAnalytics from './pages/vet/Analytics';
import VetSettings from './pages/vet/Settings';

// ================= SHARED PAGES =================
import Marketplace from './pages/shared/Marketplace'; 
import ProductDetails from './pages/shared/ProductDetails'; 
import Checkout from './pages/shared/Checkout'; 
import OrderConfirmation from './pages/shared/OrderConfirmation'; 
import Orders from './pages/shared/Orders'; 
import OrderDetails from './pages/shared/OrderDetails'; 
import ContactSupport from './pages/shared/ContactSupport';

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

function App() {
  return (
    // ✅ WRAP THE ENTIRE APP IN CART PROVIDER
    <CartProvider>
      <Toaster position="top-center" reverseOrder={false} />

      <Router>
        <Routes>
          
          <Route path="/" element={<Landing />} /> 
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ================= ADMIN ROUTES ================= */}
          <Route path="/admin" element={
              <RoleRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </RoleRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            
            <Route path="users" element={<Users />} />
            <Route path="doctors" element={<DoctorList />} />
            
            {/* Admin Marketplace & Orders routes */}
            <Route path="marketplace" element={<Marketplace />} /> 
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="orders" element={<Orders />} /> 
            <Route path="orders/:id" element={<OrderDetails />} /> 
            
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
            <Route path="analytics" element={<VetAnalytics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<VetSettings />} />
            
            {/* SHARED E-COMMERCE FEATURES */}
            <Route path="marketplace" element={<Marketplace />} /> 
            <Route path="product/:id" element={<ProductDetails />} /> 
            <Route path="checkout" element={<Checkout />} /> 
            <Route path="order-confirmation" element={<OrderConfirmation />} /> 
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            
            <Route path="support" element={<ContactSupport />} />
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

            <Route path="health" element={<HealthRecords />} />
            <Route path="payments" element={<Payments />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            
            {/* SHARED E-COMMERCE FEATURES */}
            <Route path="marketplace" element={<Marketplace />} /> 
            <Route path="product/:id" element={<ProductDetails />} /> 
            <Route path="checkout" element={<Checkout />} /> 
            <Route path="order-confirmation" element={<OrderConfirmation />} /> 
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            
            <Route path="support" element={<ContactSupport />} />
          </Route>

          {/* ================= DEBUGGING 404 CATCH ALL ================= */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-center p-6">
              <h1 className="text-4xl font-bold text-red-500 mb-4">404 Route Error</h1>
              <p className="text-slate-700 dark:text-slate-300 text-lg">React Router could not find this URL.</p>
              <p className="text-slate-500 mt-2 font-mono">Check your browser URL bar. Is it spelled exactly right?</p>
              <button 
                onClick={() => window.location.href = '/'} 
                className="mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
              >
                Go to Home
              </button>
            </div>
          } />

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;