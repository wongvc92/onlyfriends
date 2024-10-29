import React, { createContext, useState, useEffect } from "react";
import { IUserClient } from "./types/ICheckAuth";
import apiClient from "./utils/apiClient";
import { toast } from "./hooks/use-toast";

export const checkIfAuthenticated = async (): Promise<{ isAuthenticated: boolean; user: IUserClient | null }> => {
  const options = {
    method: "GET",
  };
  const response = await apiClient("/api/check-auth", options);
  if (response.error) {
    return { isAuthenticated: false, user: null };
  }
  return { isAuthenticated: true, user: response.user };
};

export interface IAuthContext {
  setAuthState: React.Dispatch<
    React.SetStateAction<{
      isAuthenticated: boolean;
      user: IUserClient | null;
    }>
  >;
  authState: {
    isAuthenticated: boolean;
    user: IUserClient | null;
  };
  showTwoFactor: boolean;
  loginUser: (code: string, email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{ isAuthenticated: boolean; user: IUserClient | null }>({
    isAuthenticated: false,
    user: null,
  });

  const [showTwoFactor, setShowTwoFactor] = useState(false);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const data = await checkIfAuthenticated();

  //     setAuthState({
  //       isAuthenticated: data.isAuthenticated,
  //       user: data.user,
  //     });
  //   };
  //   if (authState.isAuthenticated === false) {
  //     checkAuth();
  //   }
  // }, []);

  console.log("data checkAuth", authState);

  const loginUser = async (code: string, email: string, password: string) => {
    console.log("loginUser....");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.log("errorData", errorData);
      toast({
        variant: "destructive",
        description: errorData.message,
      });

      return;
    }
    const data = await res.json();

    if (data.twoFactor === true) {
      setShowTwoFactor(true);
      toast({
        variant: "default",
        description: "Please check email for two factor code",
      });
    }

    console.log("data login", data);

    setAuthState({ isAuthenticated: true, user: data.user });
  };

  const logoutUser = async () => {
    let url;

    const options = {
      method: "POST",
    };
    await apiClient("/api/logout", options);

    setAuthState({ isAuthenticated: false, user: null });
  };

  return <AuthContext.Provider value={{ authState, setAuthState, showTwoFactor, loginUser, logoutUser }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
