import express from "express";
import cors from "cors";
import loginRoutes from "./routes/loginRoutes";
import registerRoutes from "./routes/registerRoutes";
import logoutRoutes from "./routes/logoutRoutes";
import passport from "./config/passport-config";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/postsRoutes";
import profileRoutes from "./routes/profileRoutes";
import peopleRouters from "./routes/peopleRoutes";
import friendRoutes from "./routes/friendRoutes";
import likeRoutes from "./routes/likeRoutes";
import commentRoutes from "./routes/commentRoutes";
import imageRoutes from "./routes/imageRoutes";
import { S3Client } from "@aws-sdk/client-s3";
import messageRoutes from "./routes/messageRoutes";
import { Server } from "socket.io";
import { createServer } from "http";
import pool from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import { authenticateJWT } from "./middleware/authenticateJWT";
import conversationRoutes from "./routes/conversationRoutes";

const app = express();
const PORT = 5005;
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:3001", // Your client URL
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

app.use(loginRoutes);
app.use(registerRoutes);
app.use(logoutRoutes);
app.use(authRoutes);
app.use(postRoutes);
app.use(profileRoutes);
app.use(peopleRouters);
app.use(friendRoutes);
app.use(likeRoutes);
app.use(commentRoutes);
app.use(imageRoutes);
app.use("/api/messages", authenticateJWT, messageRoutes);
app.use("/api/conversations", authenticateJWT, conversationRoutes);

app.use(errorHandler);
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Listen for events
  socket.on("send_message", async (data) => {
    console.log("Message received:", data);

    // const addedText = await addText(
    //   data.text,
    //   data.sender_id,
    //   data.recipient_id,
    //   data.conversationId
    // );

    // console.log("addedText", addedText);
    // // Broadcast the message to all connected clients
    // io.emit("new_message", addedText);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

pool.connect();
