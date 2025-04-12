import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const justLoggedOut =
          sessionStorage.getItem("justLoggedOut") === "true";

        if (justLoggedOut) {
          setLoading(false);
          return;
        }

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${parsedUser.token}`;

          try {
            await axios.get("http://localhost:5000/api/auth/verify");
          } catch (err) {
            localStorage.removeItem("user");
            setUser(null);
            delete axios.defaults.headers.common["Authorization"];
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  const logout = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      let token = "";

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        token = parsedUser.token;
      }

      sessionStorage.setItem("justLoggedOut", "true");

      if (token) {
        await axios.get("http://localhost:5000/api/auth/logout", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.get("http://localhost:5000/api/auth/logout");
      }

      localStorage.removeItem("user");

      delete axios.defaults.headers.common["Authorization"];

      setUser(null);

      return true;
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
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
