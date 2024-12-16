import { HTTPSTATUS } from "../config/http.config";
import CustomError from "./CustomError";

export class ValidationError extends CustomError {
  errors: any[];

  constructor(message: string, errors: any[]) {
    super(message, HTTPSTATUS.BAD_REQUEST); // 400 for Bad Request
    this.errors = errors;
  }
}
