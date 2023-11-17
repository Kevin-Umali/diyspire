"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";

import { logoutUser, refreshToken } from "@/lib/api-helper";
import { useToast } from "@/components/ui/use-toast";

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

  const { toast } = useToast();

  useEffect(() => {
    const checkAuthenticationStatus = async () => {
      try {
        const response = await refreshToken();
        if (response.data?.accessToken) {
          setAccessToken(response.data.accessToken);
          setUser({
            id: response.data.id,
            username: response.data.username,
          });
        }
      } catch (error) {}
    };

    checkAuthenticationStatus();
  }, []);

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
        if (error instanceof AxiosError) {
          toast({
            title: `API ERROR - ${error.code}`,
            description: error.response?.data.error || "An error occurred while fetching data from the API.",
          });
        } else {
          toast({
            title: "Unexpected Error!",
            description: "An unexpected error occurred. Please try again later.",
          });
        }
      }
    }
  }, [accessToken, toast]);

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
