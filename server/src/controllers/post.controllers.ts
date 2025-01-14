import { Request, Response } from "express";
import { deletePostSchema, editPostSchema, getAllPostSchema, getPostByPostIdSchema, postSchema } from "../validation/postsSchema";
import AuthError from "../error/AuthError";
import { postServices } from "../services/post.services";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middleware/asyncHandler";
import BadRequestError from "../error/BadRequestError";
import { notificationServices } from "../services/notification.services";

const createPost = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new AuthError("Please login");
  }

  const { post, images } = postSchema.parse(req.body);

  const createdPost = await postServices.createpost(post, currentUser.id);

  const createdPostImages: { id: string; url: string }[] = [];
  if (images && images.length > 0) {
    for (const image of images) {
      const createdPostImage = await postServices.createPostImage(image.url, createdPost.id);

      createdPostImages.push(createdPostImage);
    }
  }

  res.status(HTTPSTATUS.CREATED).json({ post: { ...createdPost, images: createdPostImages }, message: "Post created" });
});

const editPostById = asyncHandler(async (req: Request, res: Response) => {
  const parsed = editPostSchema.parse(req);
  const { body, params } = parsed;
  const { post } = body;
  const { postId } = params;
  const editedPost = await postServices.editPostById(post, postId);
  res.status(HTTPSTATUS.CREATED).json({ post: editedPost, message: "Post updated" });
});

const getPostsByUsername = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new AuthError("Please login");
  }

  const username = req.params.username;
  if (!username) {
    throw new BadRequestError("username is required");
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const totalPosts = await postServices.getPostsByUsernameCount(username);
  const totalPages = Math.ceil(totalPosts / limit);

  const posts = await postServices.getPostsByUsername(currentUser.id, username, limit, offset);

  res.status(HTTPSTATUS.OK).json({
    data: posts,
    currentPage: page,
    nextPage: page < totalPages ? page + 1 : null,
    totalPages,
    totalPosts,
  });
});

const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new AuthError("Please login");
  }

  const { params } = deletePostSchema.parse(req);
  const { postId } = params;

  const deletedPost = await postServices.deletePost(postId, currentUser.id);

  await notificationServices.deleteNotification({ recipient_id: currentUser.id, source_id: postId, type: "post" });

  res.status(HTTPSTATUS.OK).json({ post: deletedPost, message: "Post deleted!" });
});

const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new AuthError("Please login");
  }
  const { query } = getAllPostSchema.parse(req);
  const { limit, page } = query;

  const offset = (page - 1) * limit;

  const totalPosts = await postServices.getAllPostsCount();
  const totalPages = Math.ceil(totalPosts / limit);

  const posts = await postServices.getAllPosts(limit, offset, currentUser.id);

  res.status(HTTPSTATUS.OK).json({
    data: posts,
    currentPage: page,
    nextPage: page < totalPages ? page + 1 : null,
    totalPages,
    totalPosts,
  });
});

const getSinglePostById = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new AuthError("Please login");
  }
  const { params } = getPostByPostIdSchema.parse(req);
  const { postId } = params;

  const post = await postServices.getSinglePostById(postId, currentUser.id);

  res.status(HTTPSTATUS.OK).json({
    post,
  });
});

export const postControllers = {
  createPost,
  editPostById,
  getPostsByUsername,
  deletePost,
  getAllPosts,
  getSinglePostById,
};
