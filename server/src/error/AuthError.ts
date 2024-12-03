import CustomError from "./CustomError";

class AuthError extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}

export default AuthError;
