import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Pages (Both use the Signup component) */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;