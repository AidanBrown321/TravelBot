import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    authenticated: null,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load token from storage
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Fetch user profile
          const response = await axios.get(`${BASE_URL}/users/me`);

          setAuthState({
            token,
            authenticated: true,
            user: response.data,
          });
        }
      } catch (e) {
        console.log("Failed to load token", e);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        username,
        email,
        password,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Registration failed",
      };
    }
  };

  const login = async (username, password) => {
    try {
      // FastAPI expects form data for token endpoint
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(`${BASE_URL}/token`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { access_token } = response.data;

      // Store token
      await AsyncStorage.setItem("token", access_token);

      // Set auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      // Fetch user info
      const userResponse = await axios.get(`${BASE_URL}/users/me`);

      setAuthState({
        token: access_token,
        authenticated: true,
        user: userResponse.data,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed",
      };
    }
  };

  const logout = async () => {
    // Remove token from storage
    await AsyncStorage.removeItem("token");

    // Remove auth header
    delete axios.defaults.headers.common["Authorization"];

    // Update state
    setAuthState({
      token: null,
      authenticated: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
