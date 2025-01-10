import { z } from "zod";

export const contentMaxLimit = 255;

export const postSchema = z.object({
  post: z.coerce.string().max(contentMaxLimit),
  images: z.optional(z.array(z.object({ url: z.string().max(255) })).max(10, { message: "Only max 10 images allowed" })),
});

export type TPostSchema = z.infer<typeof postSchema>;

export const getAllPostSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
  }),
});

export const editPostSchema = z.object({
  params: z.object({
    postId: z.string().uuid(),
  }),
  body: z.object({
    post: z.coerce.string().max(contentMaxLimit).optional(),
  }),
});

export type TEditPostSchema = z.infer<typeof editPostSchema>;

export const getPostByUsernameSchema = z.object({
  params: z.object({
    username: z.coerce.string(),
  }),
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
  }),
});

export type TGetPostByUsernameSchema = z.infer<typeof getPostByUsernameSchema>;

export const getPostByPostIdSchema = z.object({
  params: z.object({
    postId: z.string().uuid(),
  }),
});

export type TGetPostByPostIdSchema = z.infer<typeof getPostByPostIdSchema>;

export const deletePostSchema = z.object({
  params: z.object({ postId: z.string().uuid() }),
});

export type TDeletePostSchema = z.infer<typeof deletePostSchema>;
