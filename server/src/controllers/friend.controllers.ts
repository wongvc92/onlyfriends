import { Request, Response } from "express";
import { addFriendSchema } from "../validation/friendSchema";
import AuthError from "../error/AuthError";
import { asyncHandler } from "../middleware/asyncHandler";
import { friendServices } from "../services/friend.services";
import BadRequestError from "../error/BadRequestError";
import { HTTPSTATUS } from "../config/http.config";

const createFriend = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new AuthError("Please login");
  }

  const { peopleId } = addFriendSchema.parse(req.body);

  const existingRequestCount = await friendServices.getExistingFriendRequestCount(currentUser.id, peopleId);

  if (existingRequestCount > 0) {
    throw new BadRequestError("Friend request already exists");
  }

  await friendServices.createFriend(currentUser.id, peopleId);

  res.status(HTTPSTATUS.CREATED).json({ message: "Successfully add friend!" });
});

const deleteFriend = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("Please login");
  }

  const { peopleId } = addFriendSchema.parse(req.params);

  friendServices.deleteFriend(currentUser.id, peopleId);
  res.status(HTTPSTATUS.OK).json({ message: "Successfully remove friend!" });
});

const getFriendRequests = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new AuthError("Please login");
  }
  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);
  const offset = (page - 1) * limit;
  if (!page || !limit) {
    throw new BadRequestError("page or limit is required");
  }

  const totalCount = await friendServices.getFriendRequestsCount(currentUser.id);
  const totalPages = Math.ceil(totalCount / limit);
  const friendsRequests = await friendServices.getFriendRequests(currentUser.id, offset, limit);

  res.status(HTTPSTATUS.OK).json({ data: friendsRequests, totalCount, nextPage: page < totalPages ? page + 1 : null, totalPages, currentPage: page });
});

const getAcceptedFriends = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new AuthError("Please login");
  }

  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);
  const offset = (page - 1) * limit;
  const query = req.query.query as string | undefined;

  const totalCount = await friendServices.getAcceptedFriendsCount(currentUser.id, query);
  const totalPages = Math.ceil(totalCount / limit);

  const friendsRequests = await friendServices.getAcceptedFriends(currentUser.id, query, limit, offset);

  res.status(HTTPSTATUS.OK).json({ data: friendsRequests, currentPage: page, nextPage: page < totalPages ? page + 1 : null, totalCount, totalPages });
});

const getSentFriendRequests = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new AuthError("Please login");
  }

  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);
  const offset = (page - 1) * limit;

  const totalCount = await friendServices.getSentFriendRequestsCount(currentUser.id);

  const totalPages = Math.ceil(totalCount / limit);

  const sentRequests = await friendServices.getSentFriendRequests(currentUser.id, offset, limit);

  res.status(HTTPSTATUS.OK).json({ data: sentRequests, totalCount, nextPage: page < totalPages ? page + 1 : null, currentPage: page, totalPages });
});

const editFriendStatusById = asyncHandler(async (req: Request, res: Response) => {
  const friendRequestId = req.params.friendRequestId;
  if (!friendRequestId) {
    throw new BadRequestError("Please provide friend RequestId");
  }

  await friendServices.editFriendStatusById(friendRequestId);
  res.status(HTTPSTATUS.OK).json({ message: "Succesfully edit status" });
});

const getFriendStatusByPeopleId = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("Please login");
  }

  const peopleId = req.params.peopleId;
  if (!peopleId) {
    throw new BadRequestError("peopleId is needed");
  }

  const { friendStatus, isFriend } = await friendServices.getFriendStatus(peopleId, currentUser.id);
  res.status(HTTPSTATUS.OK).json({ isFriend, friendStatus });
});

export const friendControllers = {
  createFriend,
  deleteFriend,
  getFriendRequests,
  getAcceptedFriends,
  getSentFriendRequests,
  editFriendStatusById,
  getFriendStatusByPeopleId,
};
