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

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:3001", // Your client URL
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());

app.use(loginRoutes);
app.use(registerRoutes);
app.use(logoutRoutes);
app.use(authRoutes);
app.use(postRoutes);
app.use(profileRoutes);
app.use(peopleRouters);
app.use(friendRoutes);
app.use(likeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
