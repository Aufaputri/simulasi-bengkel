import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { DEFAULT_API_URL } from "../api/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [loading, setLoading] = useState(true);

  // Inisialisasi auth & settings dari AsyncStorage
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const savedUrl = await AsyncStorage.getItem("custom_api_url");
        if (savedUrl) {
          setApiUrl(savedUrl);
        }

        const savedToken = await AsyncStorage.getItem("user_token");
        const savedUser = await AsyncStorage.getItem("user_data");

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Gagal membaca auth storage:", e);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  // Update Base URL API
  const updateApiUrl = async (newUrl) => {
    try {
      const cleanUrl = newUrl.trim().replace(/\/+$/, "");
      await AsyncStorage.setItem("custom_api_url", cleanUrl);
      setApiUrl(cleanUrl);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // Reset Base URL API ke default
  const resetApiUrl = async () => {
    try {
      await AsyncStorage.removeItem("custom_api_url");
      setApiUrl(DEFAULT_API_URL);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.data && res.data.success) {
        const { token: userToken, user: userData } = res.data;

        await AsyncStorage.setItem("user_token", userToken);
        await AsyncStorage.setItem("user_data", JSON.stringify(userData));

        setToken(userToken);
        setUser(userData);

        return { success: true, user: userData };
      } else {
        return {
          success: false,
          message: res.data?.message || "Login gagal, silakan coba lagi.",
        };
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        (err.code === "ECONNABORTED"
          ? "Koneksi timeout. Pastikan server backend berjalan dan URL IP sudah benar."
          : err.message || "Gagal terhubung ke server backend");
      return { success: false, message: errMsg };
    }
  };

  // Register
  const register = async ({ nama, email, password, no_hp, address }) => {
    try {
      const res = await api.post("/auth/register", {
        nama: nama.trim(),
        email: email.trim().toLowerCase(),
        password,
        no_hp: no_hp.trim(),
        address: address ? address.trim() : null,
      });

      if (res.data && res.data.success) {
        const { token: userToken, user: userData } = res.data;

        await AsyncStorage.setItem("user_token", userToken);
        await AsyncStorage.setItem("user_data", JSON.stringify(userData));

        setToken(userToken);
        setUser(userData);

        return { success: true, user: userData };
      } else {
        return {
          success: false,
          message: res.data?.message || "Registrasi gagal.",
        };
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Gagal terhubung ke server backend";
      return { success: false, message: errMsg };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user_token");
      await AsyncStorage.removeItem("user_data");
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error("Gagal logout:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        apiUrl,
        loading,
        login,
        register,
        logout,
        updateApiUrl,
        resetApiUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
