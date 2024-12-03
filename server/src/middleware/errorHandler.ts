import { ErrorRequestHandler } from "express";
import CustomError from "../error/CustomError";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error("Error stack:", error.stack);

  if (error instanceof CustomError) {
    // Handle custom errors
    res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    // Handle zod errors
    res.status(400).json({
      message: "Validation Error",
      errors: error.errors.map((e) => ({
        path: e.path,
        message: e.message,
      })),
    });
  }
  // Handle generic errors
  res.status(500).json({
    message: error.message,
  });
};
