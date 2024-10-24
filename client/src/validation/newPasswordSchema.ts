import { z } from "zod";

export const newPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type TNewPasswordSchema = z.infer<typeof newPasswordSchema>;
