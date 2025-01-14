import { Request, Response } from "express";
import AuthError from "../error/AuthError";
import { poepleServices } from "../services/people.services";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middleware/asyncHandler";
import { getPeopleSchema } from "../validation/peopleValidation";

const getPeoples = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new AuthError("Please login");
  }

  const { limit, page, query } = getPeopleSchema.parse(req.query);

  const offset = (page - 1) * limit;

  const totalCount = await poepleServices.getPeoplesCount(currentUser.id, query);
  const totalPages = Math.ceil(totalCount / limit);

  const peoples = await poepleServices.getPeoples(currentUser.id, offset, limit, query);
  res.status(HTTPSTATUS.OK).json({ data: peoples, currentPage: page, totalCount, nextPage: page < totalPages ? page + 1 : null, totalPages });
});

export const peopleControllers = {
  getPeoples,
};
