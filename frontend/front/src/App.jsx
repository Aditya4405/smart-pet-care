import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Profile from './pages/Profile'; // <--- IMPORT THIS

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signup />} />
        
        {/* 👇 ADD THIS NEW ROUTE 👇 */}
        <Route path="/profile" element={<Profile />} />
        
      </Routes>
    </Router>
  );
}

export default App;