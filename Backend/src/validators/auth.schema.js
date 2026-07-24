import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(1, "Password is required"),
  }),
});

export const publicRegisterSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.string().optional(),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["admin", "member"]).default("member"),
  }),
});
