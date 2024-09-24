import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string({
      required_error: "username is required",
      invalid_type_error: "Username must be String",
    })
    .min(2, "username should be at least 2 characters").trim(),
  password: z
    .string({ required_error: "password is required" })
    .min(8, "Password should be more than 8 characters").trim(),

  email: z
    .string({ required_error: "email is required" })
    .email({ message: "Invalid email address" }).trim(),
});
