import { z } from "zod";

export const newPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, { message: "Please provide the same password", path: ["confirmPassword"] });

export type TNewPasswordSchema = z.infer<typeof newPasswordSchema>;
