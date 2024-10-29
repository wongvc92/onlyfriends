import { Router } from "express";
import { logoutUser } from "../controllers/logoutContollers";
import passport from "../config/passport-config";

const logoutRoutes = Router();

logoutRoutes.post("/api/logout", passport.authenticate("jwt", { session: false }), logoutUser);

export default logoutRoutes;
