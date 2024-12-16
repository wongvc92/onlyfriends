import { Server } from "socket.io";
import http from "http";
import { config } from "../config/app.config";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.APP_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users: Record<string, string> = {};

export const getReceiverSocketId = (recipient_id: string) => {
  return users[recipient_id];
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (typeof userId === "string") {
    users[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    delete users[userId as string];
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, io, server };
