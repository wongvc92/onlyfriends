import { z } from "zod";

export const getNotificationSchema = z.object({
  params: z.object({
    user_id: z.string().uuid(),
  }),
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
  }),
});

export type TGetNotificationSchema = z.infer<typeof getNotificationSchema>;

export const updateNotificationSchema = z.object({
  params: z.object({
    notificationId: z.string().uuid(),
  }),
});

export type TUpdateNotificationSchema = z.infer<typeof updateNotificationSchema>;

export const getUnopenNotificationByRecipientIdSchema = z.object({
  params: z.object({
    user_id: z.string().uuid(),
  }),
});

export type TGetUnopenNotificationByRecipientIdSchema = z.infer<typeof getUnopenNotificationByRecipientIdSchema>;

export const updateUnopenNotificationSchema = z.object({
  params: z.object({
    user_id: z.string().uuid(),
  }),
  body: z.object({
    type: z.union([z.literal("increment"), z.literal("decrement"), z.literal("reset")]),
  }),
});

export type TUpdateUnopenNotificationSchema = z.infer<typeof updateUnopenNotificationSchema>;
