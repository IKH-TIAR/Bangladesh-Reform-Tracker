import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      sessionStorage.setItem("justLoggedOut", "true");

      await logout();

      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);

      sessionStorage.setItem("justLoggedOut", "true");

      window.location.href = "/";
    }
  };

  return (
    <nav className="bg-green-600 fixed w-full z-10 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-white text-xl font-semibold">
                Reform Tracker Bangladesh
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/dashboard"
                className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/surveys"
                className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Surveys
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">{user.name}</span>
                  <div className="h-8 w-8 bg-white rounded-full overflow-hidden">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-green-800 text-white font-medium">
                        {user && user.name
                          ? user.name.charAt(0).toUpperCase()
                          : ""}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white text-green-700 hover:bg-gray-100 px-3 py-1 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
