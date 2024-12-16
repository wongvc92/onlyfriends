import { NextFunction, Request, Response } from "express";

const logRequestPath = (req: Request, res: Response, next: NextFunction) => {
  const time = new Date();
  console.log("Request incoming from: ", `${req.path} - ${time}`);
  next();
};

export default logRequestPath;
