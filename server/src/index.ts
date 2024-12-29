import dotenv from "dotenv";
dotenv.config(); // Remove the path option to look for .env in root

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/postsRoutes";
import profileRoutes from "./routes/profileRoutes";
import peopleRouters from "./routes/peopleRoutes";
import friendRoutes from "./routes/friendRoutes";
import likeRoutes from "./routes/likeRoutes";
import commentRoutes from "./routes/commentRoutes";
import { S3Client } from "@aws-sdk/client-s3";
import messageRoutes from "./routes/messageRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { authenticateJWT } from "./middleware/authenticateJWT";
import conversationRoutes from "./routes/conversationRoutes";
import userRoutes from "./routes/userRoutes";
import { config } from "./config/app.config";
import s3Routes from "./routes/imageRoutes";
import logRequestPath from "./middleware/logRequestPath";
import { app, server } from "./socket/socket";

app.use(
  cors({
    origin: [config.APP_ORIGIN, "http://localhost"],
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logRequestPath);

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", authenticateJWT, postRoutes);
app.use("/api/profiles", authenticateJWT, profileRoutes);
app.use("/api/peoples", authenticateJWT, peopleRouters);
app.use("/api/friends", authenticateJWT, friendRoutes);
app.use("/api/likes", authenticateJWT, likeRoutes);
app.use("/api/comments", authenticateJWT, commentRoutes);
app.use("/api/s3", authenticateJWT, s3Routes);
app.use("/api/messages", authenticateJWT, messageRoutes);
app.use("/api/conversations", authenticateJWT, conversationRoutes);

app.use(errorHandler);

server.listen(config.PORT, () => {
  console.log(`Server is listening on http://localhost:${config.PORT} in ${config.NODE_ENV}`);
});
