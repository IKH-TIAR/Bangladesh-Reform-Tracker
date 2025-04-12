import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Gov Reform Tracker
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/create-survey" className="nav-links">
              Create Survey
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/view-surveys" className="nav-links">
              View Surveys
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/all-proposals" className="nav-links">
                All Proposals
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;