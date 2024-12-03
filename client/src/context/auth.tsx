import React, { createContext, useState } from "react";
import { IUserClient } from "../types/ICheckAuth";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

const url =
  process.env.NODE_ENV === "development" ? `${BASE_URL}/api/user` : "/api/user";

export const getUser = async (): Promise<IUserClient> => {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Unable to fetch data");
  }
  const data = await response.json();
  return data.user;
};

export interface IAuthContext {
  error: Error | null;
  isLoading: boolean;
  user?: IUserClient | null;
  isAuthenticated: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    data: user,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
    retry: false,
  });
  let isAuthenticated;

  if (isSuccess) {
    isAuthenticated = !!user;
    // setAuth({ username: user.username, email: user.email, id: user.id });
  }

  console.log("AuthProvider", user);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated as boolean,
        user,
        isLoading,
        error,
        refetch,
      }}
    >
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
