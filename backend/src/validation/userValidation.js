import { z } from "zod";

// Register validation schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(), // Removes spaces from beginning/end

  email: z
    .string()
    .email("Please provide a valid email address")
    .toLowerCase() // Converts to lowercase
    .trim(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),

  password: z.string().min(1, "Password is required"),
});
