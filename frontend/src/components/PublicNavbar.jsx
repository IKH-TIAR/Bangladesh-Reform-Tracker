import React from 'react';
import { Link } from 'react-router-dom';

const PublicNavbar = () => {
  return (
    <nav className="bg-green-600 fixed w-full z-10 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-white text-xl font-semibold">Reform Tracker Bangladesh</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="bg-white text-green-700 hover:bg-gray-100 px-3 py-1 rounded-md text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="border border-white text-white hover:bg-green-700 px-3 py-1 rounded-md text-sm font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;