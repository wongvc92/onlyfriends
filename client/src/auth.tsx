import React, { createContext, useEffect } from "react";
import { IUserClient } from "./types/ICheckAuth";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const checkIfAuthenticated = async () => {
  const response = await fetch(`${BASE_URL}/api/check-auth`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Unable to fetch data");
  }
  const data = await response.json();

  return data.user;
};

const refreshAccessToken = async () => {
  const response = await fetch(`${BASE_URL}/api/refresh-token`, {
    method: "POST",
    credentials: "include", // Include cookies to send the refresh token
  });

  if (!response.ok) {
    throw new Error("Unable to refresh token");
  }

  const data = await response.json();
  return data;
};

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: checkIfAuthenticated,
    retry: false,
  });
};

export interface IAuthContext {
  error: Error | null;
  isLoading: boolean;
  user?: IUserClient | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, error, refetch } = useAuthQuery();
  let isAuthenticated;
  isAuthenticated = !!user;

  // Refresh token every 14 minutes (assuming a 15-minute expiry on the access token)
  useEffect(() => {
    const refreshTokenInterval = setInterval(
      async () => {
        try {
          await refreshAccessToken();
          await refetch(); // Refetch user data after refreshing the token
        } catch (error) {
          isAuthenticated = false;
          console.error("Token refresh failed:", error);
        }
      },
      14 * 60 * 1000
    ); // 14 minutes in milliseconds

    return () => clearInterval(refreshTokenInterval); // Clear the interval on unmount
  }, [refetch]);

  return <AuthContext.Provider value={{ isAuthenticated, user, isLoading, error }}>{isLoading ? null : children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
