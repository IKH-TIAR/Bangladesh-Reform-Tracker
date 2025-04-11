import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import AuthContext, { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PublicNavbar from "./components/PublicNavbar";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import ReformDetail from "./pages/ReformDetail";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import SurveyList from "./pages/SurveyList";
import SurveyResponse from "./pages/SurveyResponse";

// Private route component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const justLoggedOut = sessionStorage.getItem('justLoggedOut') === 'true';

  // If just logged out, redirect to home
  if (justLoggedOut) {
    return <Navigate to="/" replace />;
  }

  // If still checking authentication status, show loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Return children if authenticated
  return children;
};

// Redirect authenticated users away from login/signup pages
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const justLoggedOut = sessionStorage.getItem('justLoggedOut') === 'true';

  // If just logged out, show the children (login/signup)
  if (justLoggedOut) {
    return children;
  }

  // If still checking authentication status, show loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Return children if not authenticated
  return children;
};

// Layout component that conditionally renders navbar based on authentication and current route
const Layout = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Check if the current path is login or signup
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Only show navbar if user is authenticated OR if on homepage (not auth pages) */}
      {(user || (!user && !isAuthPage)) &&
        (user ? <Navbar /> : <PublicNavbar />)}
      <main
        className={user || (!user && !isAuthPage) ? "pt-16 pb-12" : "pb-12"}
      >
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const justLoggedOut = sessionStorage.getItem('justLoggedOut') === 'true';

  // Clear the flag after it's used, but only after the component has mounted
  useEffect(() => {
    const clearLogoutFlag = () => {
      if (justLoggedOut && location.pathname === '/') {
        // Only clear after we've reached the homepage
        setTimeout(() => {
          sessionStorage.removeItem('justLoggedOut');
        }, 500); // Small delay to ensure everything is loaded
      }
    };
    
    clearLogoutFlag();
  }, [justLoggedOut, location.pathname]);

  return (
    <Routes>
      {/* Public Home Page */}
      <Route 
        path="/" 
        element={
          <Layout>
            {/* If just logged out or no user, show HomePage */}
            {justLoggedOut || !user ? (
              <HomePage />
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </Layout>
        } 
      />

      {/* Auth routes */}
      <Route
        path="/login"
        element={
          <Layout>
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          </Layout>
        }
      />
      <Route
        path="/signup"
        element={
          <Layout>
            <PublicRoute>
              <SignupForm />
            </PublicRoute>
          </Layout>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          </Layout>
        }
      />
      <Route
        path="/reforms/:id"
        element={
          <Layout>
            <PrivateRoute>
              <ReformDetail />
            </PrivateRoute>
          </Layout>
        }
      />

      {/* Survey routes */}
      <Route
        path="/surveys"
        element={
          <Layout>
            <PrivateRoute>
              <SurveyList />
            </PrivateRoute>
          </Layout>
        }
      />
      <Route
        path="/surveys/:id"
        element={
          <Layout>
            <PrivateRoute>
              <SurveyResponse />
            </PrivateRoute>
          </Layout>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;