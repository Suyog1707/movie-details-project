import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/user/getinfo`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCurrentUser(response.data);
      } catch (error) {
        localStorage.removeItem("token");
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = async (data) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/v1/user/signup`,
      data
    );

    localStorage.setItem("token", response.data.token);

    const { token, ...user } = response.data;
    setCurrentUser(user);

    return response.data;
  };

  const login = async (data) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/v1/user/signin`,
      data
    );

    localStorage.setItem("token", response.data.token);

    const { token, ...user } = response.data;
    setCurrentUser(user);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      loading,
      login,
      register,
      logout,
    }),
    [currentUser, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};