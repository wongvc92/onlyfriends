import { ErrorRequestHandler } from "express";
import CustomError from "../error/CustomError";
import { ZodError } from "zod";
import { HTTPSTATUS } from "../config/http.config";

export const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {
  console.error("Error stack:", error.stack, req.path);
  console.error("Error path:", req.path);

  if (error instanceof CustomError) {
    // Handle custom errors
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid JSON format" });
  }

  if (error instanceof ZodError) {
    // Handle zod errors
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: `${error.issues[0].message} - ${error.issues[0].path} `,
    });
  }
  // Handle generic errors
  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: error.message,
  });
};
