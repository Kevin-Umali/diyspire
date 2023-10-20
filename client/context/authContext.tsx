"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { logoutUser } from "@/lib";

interface User {
  id: string;
  username: string;
}

interface AuthContextProps {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (data: { user: User; token: string }) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<Partial<AuthContextProps>>({});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = (data: { user: User; token: string }) => {
    setUser(data.user);
    setAccessToken(data.token);
  };

  const logout = useCallback(async () => {
    if (accessToken) {
      try {
        await logoutUser(accessToken);

        setUser(null);
        setAccessToken(null);
      } catch (error) {
        console.error("Failed to log out:", error);
      }
    }
  }, [accessToken]);

  const contextValue = useMemo(() => {
    return {
      user,
      accessToken,
      isAuthenticated: !!user,
      login,
      logout,
    };
  }, [user, accessToken, logout]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
