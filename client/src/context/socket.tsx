import React, { createContext, useContext, ReactNode } from "react";

import { DefaultEventsMap } from "@socket.io/component-emitter";

import { io, Socket } from "socket.io-client";
type SocketContextType = Socket<DefaultEventsMap, DefaultEventsMap> | null;

// Create the SocketContext
const SocketContext = createContext<SocketContextType>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = io(import.meta.env.VITE_SERVER_URL!);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook for accessing the SocketContext
export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
