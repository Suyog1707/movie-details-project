import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axios/axiosClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await axiosClient.get("/api/v1/user/info");
      setUser(res.data);
    } catch (err) {
      console.log("CHECK AUTH ERROR:", err.response?.data);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    try {
      const response = await axiosClient.post(
        "/api/v1/user/signin",
        data
      );
      setUser(response.data);
      return response.data;
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  const register = async (data) => {
    try {
      const res = await axiosClient.post(
        "/api/v1/user/signup",
        data
      );

      return res;
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post("/api/v1/user/signout");
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        register,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);