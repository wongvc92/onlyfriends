import { z } from "zod";

export const resetSignInSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type TResetSignInSchema = z.infer<typeof resetSignInSchema>;
