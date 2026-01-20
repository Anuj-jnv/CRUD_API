import { z } from "zod";

// Core reusable shape
export const userCore = {
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email"),
};

// Create user request schema
export const createUserSchema = z.object({
  ...userCore,
});

// Update user request schema
export const updateUserSchema = z.object({
  ...userCore,
}).partial(); // allow partial updates

// Params for routes using :id
export const idParamSchema = z.object({
  id: z.number().int("User ID must be a number"),
});

// Base response object for a single user
export const userResponse = z.object({
  id: z.number().int(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  created_at: z.union([z.date(), z.string()])
    .transform(v => v instanceof Date ? v.toISOString() : v)
    .optional(),
  updated_at: z.union([z.date(), z.string()])
    .transform(v => v instanceof Date ? v.toISOString() : v)
    .optional(),
});

// Single user response
export const getUserResponseSchema = z.object({
  user: userResponse,
});

// All users response
export const getAllUsersResponseSchema = z.object({
  users: z.array(userResponse),
  total: z.number().optional(),
});

// Create user response
export const createUserResponseSchema = z.object({
  message: z.string(),
  user: userResponse,
});

// Update user response
export const updateUserResponseSchema = z.object({
  message: z.string(),
  user: userResponse,
});

// Delete response
export const deleteUserResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
});

// Address nested type
const addressNestedResponse = z.object({
  id: z.number().int(),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Extended nested type
export const userWithAddresses = z.object({
  id: z.number().int(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  addresses: z.array(addressNestedResponse),
});

// Aggregated response schema
export const getAllUsersWithAddressesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(userWithAddresses),
});

// TS Types inferred from Zod
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserResponse = z.infer<typeof userResponse>;
export type GetAllUsersResponse = z.infer<typeof getAllUsersResponseSchema>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;
export type UpdateUserResponse = z.infer<typeof updateUserResponseSchema>;
export type DeleteUserResponse = z.infer<typeof deleteUserResponseSchema>;
export type GetAllUsersWithAddressesResponse = z.infer<typeof getAllUsersWithAddressesResponseSchema>;
