import { Response } from "express";

export const handleResponse = (
  res: Response,
  status: number,
  message: string,
  data: any | null = null
) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};
