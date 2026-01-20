import { z } from "zod";

export const addressCore = {
  user_id: z.number().int().positive("User ID must be a positive integer"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
};

// Create Address Schema
export const createAddressSchema = z.object({
  ...addressCore,
});

// Update Address Schema (all fields optional)
export const updateAddressSchema = z.object({
  ...addressCore,
}).partial();

// Param: /addresses/:id
export const idParamSchema = z.object({
  id: z.number().int("Address ID must be a number"),
});

// Reusable Address Response Object
export const addressResponse = z.object({
  id: z.number(),
  ...addressCore,
  created_at: z.union([z.date(), z.string()])
    .transform(v => v instanceof Date ? v.toISOString() : v)
    .optional(),
  updated_at: z.union([z.date(), z.string()])
    .transform(v => v instanceof Date ? v.toISOString() : v)
    .optional(),
});

// Single Retrieval Response
export const getAddressResponseSchema = z.object({
  address: addressResponse,
});

// List Response
export const getAllAddressesResponseSchema = z.object({
  addresses: z.array(addressResponse),
});

// Query: GET /addresses or /addresses/aggregate
export const getAllAddressesQuerySchema = z.object({
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode").optional(),
  page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
  limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
});

// Create Response
export const createAddressResponseSchema = z.object({
  message: z.string(),
  address: addressResponse,
});

// Update Response
export const updateAddressResponseSchema = z.object({
  message: z.string(),
  address: addressResponse,
});

// Delete Response
export const deleteAddressResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
});

// Types
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type AddressResponse = z.infer<typeof addressResponse>;
export type GetAllAddressesResponse = z.infer<typeof getAllAddressesResponseSchema>;
export type CreateAddressResponse = z.infer<typeof createAddressResponseSchema>;
export type UpdateAddressResponse = z.infer<typeof updateAddressResponseSchema>;
export type DeleteAddressResponse = z.infer<typeof deleteAddressResponseSchema>;
export type GetAllAddressesQuery = z.infer<typeof getAllAddressesQuerySchema>;
