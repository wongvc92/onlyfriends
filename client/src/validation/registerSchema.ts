import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z.string().min(10, { message: "Username must contain at least 10 character(s)" }).max(255),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Please enter the same password.",
    path: ["confirmPassword"],
  });

export type TSignUpFormSchema = z.infer<typeof signUpSchema>;
