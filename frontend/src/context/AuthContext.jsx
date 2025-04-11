import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  // Check if user is logged in on app load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // First check if we just logged out
        const justLoggedOut = sessionStorage.getItem('justLoggedOut') === 'true';
        
        // Skip auth check if we just logged out
        if (justLoggedOut) {
          setLoading(false);
          return;
        }
        
        // Check if user is logged in from localStorage
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Set the auth token for API requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
          
          // Optional: Verify token validity with backend
          try {
            await axios.get('http://localhost:5000/api/auth/verify');
          } catch (err) {
            // If token verification fails, log out the user
            localStorage.removeItem('user');
            setUser(null);
            delete axios.defaults.headers.common['Authorization'];
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);
  
  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  // Logout function
  const logout = async () => {
    try {
      // Get the current user from localStorage to ensure we have the token
      const storedUser = localStorage.getItem('user');
      let token = '';
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        token = parsedUser.token;
      }
      
      // Set the flag before making any async calls
      sessionStorage.setItem('justLoggedOut', 'true');
      
      // Call the backend logout endpoint with proper headers
      if (token) {
        await axios.get('http://localhost:5000/api/auth/logout', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        // Just call logout without token if it's not available
        await axios.get('http://localhost:5000/api/auth/logout');
      }
      
      // Then clear local storage
      localStorage.removeItem('user');
      
      // Clear auth headers
      delete axios.defaults.headers.common['Authorization'];
      
      // Update state
      setUser(null);
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if the API call fails, still clear local state
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;