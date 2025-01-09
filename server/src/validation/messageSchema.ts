import { z } from "zod";

export const messageSchema = z.object({
  text: z.string().min(1),
  sender_id: z.string().uuid(),
  recipient_id: z.string().uuid(),
  conversationId: z.string().uuid(),
});

export type TMessageSchema = z.infer<typeof messageSchema>;

export const getMessagesByConversationIdSchema = z.object({
  params: z.object({ conversationId: z.string().uuid() }),
});

export type TGetMessagesByConversationId = z.infer<typeof getMessagesByConversationIdSchema>;
