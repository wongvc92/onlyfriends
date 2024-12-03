declare global {
  namespace Express {
    interface Request {
      user: { id: string; username: string; email: string };
    }
  }
}

export {}; // To ensure this file is treated as a module
