"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLogoutUser, useRefreshToken } from "@/api/queries";
import { AxiosError } from "axios";

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

  const { mutate: mutateRefreshToken } = useRefreshToken();
  const { mutate: mutateLogoutUser } = useLogoutUser();

  useEffect(() => {
    mutateRefreshToken(undefined, {
      onSuccess: (response, _variables, _context) => {
        if (response.data?.accessToken) {
          setAccessToken(response.data.accessToken);
          setUser({
            id: response.data.id,
            username: response.data.username,
          });
        }
      },
    });
  }, [mutateRefreshToken]);

  const login = (data: { user: User; token: string }) => {
    setUser(data.user);
    setAccessToken(data.token);
  };

  const logout = useCallback(async () => {
    if (accessToken) {
      mutateLogoutUser(accessToken, {
        onSuccess: () => {
          setUser(null);
          setAccessToken(null);
        },
        onError: (error) => {
          if (error && error instanceof AxiosError) {
            const errorMessage = error.response?.data.error || "An error occurred while fetching data from the API.";

            toast({
              title: `API ERROR - ${error.code}`,
              description: errorMessage,
            });
          } else if (error) {
            toast({
              title: "Unexpected Error!",
              description: "An unexpected error occurred. Please try again later.",
            });
          }
        },
      });
    }
  }, [accessToken, mutateLogoutUser, toast]);

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
