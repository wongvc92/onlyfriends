import { HTTPSTATUS } from "../config/http.config";
import CustomError from "./CustomError";

class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, HTTPSTATUS.BAD_REQUEST);
  }
}

export default BadRequestError;
