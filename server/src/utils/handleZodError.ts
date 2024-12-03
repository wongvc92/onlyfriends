import { ZodError } from "zod";
import { ValidationError } from "../error/ValidationError";

export const handleZodError = (zodError: ZodError): ValidationError => {
  const errors = zodError.errors.map((err) => ({
    path: err.path,
    message: err.message,
  }));
  return new ValidationError("Validation Error", errors);
};
