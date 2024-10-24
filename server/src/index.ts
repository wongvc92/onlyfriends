import express from "express";
import cors from "cors";
import loginRoutes from "./routes/loginRoutes";
import registerRoutes from "./routes/registerRoutes";
import logoutRoutes from "./routes/logoutRoutes";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use(loginRoutes);
app.use(registerRoutes);
app.use(logoutRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
