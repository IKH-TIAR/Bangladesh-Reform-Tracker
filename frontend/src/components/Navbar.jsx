// frontend/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Reform Progress Tracker</h1>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Dashboard</Link>
        <Link to="/submit-proposal" className="navbar-item">Submit Proposal</Link>
        <Link to="/all-proposals" className="navbar-item">All Proposals</Link>
        <Link to="/accepted-proposals" className="navbar-item">Accepted Proposals</Link>
      </div>
    </nav>
  );
};

export default Navbar;