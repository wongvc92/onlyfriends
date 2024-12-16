import { HTTPSTATUS } from "../config/http.config";
import CustomError from "./CustomError";

class AuthError extends CustomError {
  constructor(message: string) {
    super(message, HTTPSTATUS.UNAUTHORIZED);
  }
}

export default AuthError;
