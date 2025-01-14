import { Request } from "express";

export {};
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; username: string; email: string; name: string; display_image: string };
    cookies: { refreshToken?: string };
  }
}
