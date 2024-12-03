import { z, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { handleZodError } from "../utils/handleZodError";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next(); // Continue to the next middleware or route handler
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(handleZodError(error)); // Transform and pass the error
      }
      next(error);
    }
  };
