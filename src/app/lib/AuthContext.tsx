// src/app/lib/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if a valid token exists (e.g., in localStorage or cookies)
    const token = localStorage.getItem("jwtToken");
    setIsAuthenticated(!!token);
  }, []);

  const login = () => {
    localStorage.setItem("jwtToken", "your-token");
    setIsAuthenticated(true);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setIsAuthenticated(false);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
