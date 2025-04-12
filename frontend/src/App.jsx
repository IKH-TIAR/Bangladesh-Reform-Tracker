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

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const justLoggedOut = sessionStorage.getItem("justLoggedOut") === "true";

  if (justLoggedOut) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const justLoggedOut = sessionStorage.getItem("justLoggedOut") === "true";

  if (justLoggedOut) {
    return children;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const Layout = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

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
  const justLoggedOut = sessionStorage.getItem("justLoggedOut") === "true";

  useEffect(() => {
    const clearLogoutFlag = () => {
      if (justLoggedOut && location.pathname === "/") {
        setTimeout(() => {
          sessionStorage.removeItem("justLoggedOut");
        }, 500);
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
