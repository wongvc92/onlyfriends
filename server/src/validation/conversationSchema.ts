import { z } from "zod";

export const createConversationSchema = z.object({
  peopleId: z.string().min(1, { message: "Please provide people id" }).uuid({ message: "people id is not valid!" }),
});

export type TCreateConversationSchema = z.infer<typeof createConversationSchema>;
