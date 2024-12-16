import { z } from "zod";

export const addFriendSchema = z.object({
  peopleId: z.string().min(1, { message: "Please provide people id" }).uuid({ message: "people id is not valid!" }),
});

export type TAddFriendSchema = z.infer<typeof addFriendSchema>;
