import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(50, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
  password: z.string().min(8, "Use at least 8 characters").max(100),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const createHouseholdSchema = z.object({
  name: z.string().trim().min(2, "Household name is required").max(60),
});

export const joinHouseholdSchema = z.object({
  inviteCode: z.string().trim().min(4, "Invite code is required").max(20).toUpperCase(),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(2, "Task title is required").max(80),
  details: z.string().trim().max(500).optional().or(z.literal("")),
  cadence: z.enum(["ONE_TIME", "RECURRING"]),
  repeatEveryDays: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? Number(value) : undefined))
    .refine((value) => value === undefined || Number.isInteger(value), {
      message: "Repeat interval must be a whole number",
    })
    .refine((value) => value === undefined || value > 0, {
      message: "Repeat interval must be at least 1 day",
    }),
});

export const taskHelpSchema = z.object({
  helpNote: z.string().trim().max(280).optional().or(z.literal("")),
});

export const taskActionSchema = z.object({
  taskId: z.string().min(1),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateHouseholdInput = z.infer<typeof createHouseholdSchema>;
export type JoinHouseholdInput = z.infer<typeof joinHouseholdSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;