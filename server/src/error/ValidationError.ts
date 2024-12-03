import CustomError from "./CustomError";

export class ValidationError extends CustomError {
    errors: any[];
  
    constructor(message: string, errors: any[]) {
      super(message, 400); // 400 for Bad Request
      this.errors = errors;
    }
  }