import { Request, Response, NextFunction } from "express";

export type AsyncControllerType<P = Record<string, any>, ResBody = any, ReqBody = any, ReqQuery = any> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = <P, ResBody, ReqBody, ReqQuery>(
  controller: AsyncControllerType<P, ResBody, ReqBody, ReqQuery>
): AsyncControllerType<P, ResBody, ReqBody, ReqQuery> => {
  return async (req, res, next) => {
    try {
      return await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
