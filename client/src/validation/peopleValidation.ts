import { z } from "zod";

export const getPeopleSchema = z.object({
  query: z.coerce.string().optional(),
  page: z.coerce.string().min(1).default("1"),
  limit: z.coerce.string().min(1).default("10"),
});

export type TGetPeopleSchema = z.infer<typeof getPeopleSchema>;
