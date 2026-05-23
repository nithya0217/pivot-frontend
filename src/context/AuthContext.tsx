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
  register: (email: string, isAuthor: boolean) => void;
  logout: () => void;
  setAuthorStatus: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("pivot_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    } else {
      // Default mock user matching seed database (user_id: 3, seeded reader)
      const defaultMockUser: User = {
        user_id: 3,
        email: "mock.reader@pivot.com",
        is_author: false,
      };
      setUser(defaultMockUser);
      localStorage.setItem("pivot_user", JSON.stringify(defaultMockUser));
    }
  }, []);

  const login = (email: string, isAuthor = false) => {
    // Check if it matches seed author or create a simple mock id
    let userId = 3; // default mock reader
    if (email.toLowerCase().includes("author")) {
      userId = 2; // default mock author
      isAuthor = true;
    }
    
    const newUser: User = {
      user_id: userId,
      email,
      is_author: isAuthor,
    };
    setUser(newUser);
    localStorage.setItem("pivot_user", JSON.stringify(newUser));
  };

  const register = (email: string, isAuthor: boolean) => {
    // Generate a mock user ID for registration
    const mockId = Math.floor(Math.random() * 1000) + 10;
    const newUser: User = {
      user_id: mockId,
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
