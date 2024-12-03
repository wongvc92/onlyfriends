import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

const useSocket = (): Socket<DefaultEventsMap, DefaultEventsMap> | null => {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER_URL!); // Use `VITE_SERVER_URL` for correct environment variable
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect(); // Use `disconnect()` to properly close the connection
    };
  }, []);

  return socket;
};

export default useSocket;
