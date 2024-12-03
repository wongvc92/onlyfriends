import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production"
    ? undefined
    : import.meta.env.VITE_SERVER_URL!;

export const socket = io(URL);
