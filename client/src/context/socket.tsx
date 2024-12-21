import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";
import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_SERVER_URL;

interface ISocketProvider {
  socket: Socket | null;
  onlineUsers: string[];
}
const SocketContext = createContext<ISocketProvider | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be use within socketProvider ");
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const socketInstance = io(URL, {
        query: {
          userId: user?.id,
        },
        withCredentials: true,
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (socket) {
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [socket]);

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
