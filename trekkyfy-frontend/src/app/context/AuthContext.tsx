"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsAuthenticated(true);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("user", "authenticated");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
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
