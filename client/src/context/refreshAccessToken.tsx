import { useAuth } from "@/context/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

const url =
  process.env.NODE_ENV === "development"
    ? `${BASE_URL}/api/refresh-token`
    : "/api/refresh-token";

export const refreshAccessToken = async () => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "include", // Include cookies to send the refresh token
  });

  if (!response.ok) {
    throw new Error("Unable to refresh token");
  }

  const data = await response.json();
  return data;
};

const RefreshAccessToken = createContext(undefined);

export const RefreshAccessTokenProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isAuthenticated, refetch: refetchUser } = useAuth();
  const query = useQueryClient();
  const { error, isError, isSuccess } = useQuery({
    queryKey: ["refreshAccessToken"],
    queryFn: refreshAccessToken,
    refetchInterval: 4 * 60 * 1000,
    retry: 5,
  });

  if (isError) {
    console.log(`${error.name}-${error.message}`);
  }

  return (
    <RefreshAccessToken.Provider value={undefined}>
      {children}
    </RefreshAccessToken.Provider>
  );
};

export const useRefreshAccessToken = () => {
  const context = useContext(RefreshAccessToken);
  if (!context) {
    throw new Error(
      "useRefreshAccessToken must be used within RefreshAccessTokenProvider"
    );
  }
  return context;
};
