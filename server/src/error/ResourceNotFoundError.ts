import { HTTPSTATUS } from "../config/http.config";
import CustomError from "./CustomError";

class ResourceNotFoundError extends CustomError {
  constructor(message: string) {
    super(message, HTTPSTATUS.NOT_FOUND);
  }
}

export default ResourceNotFoundError;
