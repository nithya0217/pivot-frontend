"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  user_id: number;
  email: string;
  is_author: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, isAuthor?: boolean) => void;
  register: (user_id: number, email: string, isAuthor: boolean) => void;
  logout: () => void;
  setAuthorStatus: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem("pivot_user");
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch (e) {
    console.error("Failed to parse stored user", e);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load stored user only on the client after mount.
    // This avoids SSR/client hydration mismatch because localStorage is
    // not available during server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getStoredUser());
  }, []);

  const login = (email: string, isAuthor = false) => {
    // Generate a deterministic user id from the login email when backend is unavailable.
    const hashedId = Math.abs(
      Array.from(email.toLowerCase()).reduce((hash, char) => hash * 31 + char.charCodeAt(0), 0)
    );
    const userId = isAuthor ? 2 : (hashedId % 1000000) + 100;

    const newUser: User = {
      user_id: userId,
      email,
      is_author: isAuthor,
    };
    setUser(newUser);
    localStorage.setItem("pivot_user", JSON.stringify(newUser));
  };

  const register = (user_id: number, email: string, isAuthor: boolean) => {
    const newUser: User = {
      user_id,
      email,
      is_author: isAuthor,
    };
    setUser(newUser);
    localStorage.setItem("pivot_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pivot_user");
  };

  const setAuthorStatus = (status: boolean) => {
    if (user) {
      const updatedUser = { ...user, is_author: status };
      setUser(updatedUser);
      localStorage.setItem("pivot_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setAuthorStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
