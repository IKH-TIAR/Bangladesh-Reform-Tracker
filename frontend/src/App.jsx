// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import SignupForm from './pages/SignupPage/SignupForm';

function AppContent() {
  const location = useLocation();

  // Conditionally render Navbar only if the current route is NOT '/signup'
  const showNavbar = location.pathname !== '/signup';

  return (
    <div className="app">
      {/* Render Navbar only if showNavbar is true */}
      {showNavbar && <Navbar />}

      {/* Routing Configuration */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;