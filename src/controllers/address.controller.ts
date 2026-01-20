import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateAddressInput,
  UpdateAddressInput,
  GetAllAddressesQuery,
} from "../schemas/address.schema.js";

import {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  getAllAddressesWithPincode,
} from "../services/address.service.js";

import { sendError, handleError } from "../utils/response.js";
import { logInfo, logError } from "../utils/logger.js";

// Create Address
export const createAddressController = async (
  request: FastifyRequest<{ Body: CreateAddressInput }>,
  reply: FastifyReply
) => {
  try {
    const address = await createAddress(request.body);
    logInfo(`Address created for user ${request.body.user_id}`);

    return reply.code(201).send({
      message: "Address created successfully",
      address,
    });
  } catch (error: any) {
    logError(error?.message);
    return handleError(error, reply);
  }
};

// Get all addresses
export const getAllAddressesController = async (
  request: FastifyRequest<{ Querystring: GetAllAddressesQuery }>,
  reply: FastifyReply
) => {
  try {
    const result = await getAllAddresses(request.query.pincode);
    return reply.code(200).send(result);
  } catch (error: any) {
    logError(error?.message);
    return handleError(error, reply);
  }
};

// Get by ID
export const getAddressByIdController = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) => {
  try {
    const address = await getAddressById(request.params.id);
    if (!address) return sendError(reply, "Address not found", 404);

    return reply.code(200).send({ address });
  } catch (error: any) {
    logError(error?.message);
    return handleError(error, reply);
  }
};

// Update
export const updateAddressController = async (
  request: FastifyRequest<{ Params: { id: number }, Body: UpdateAddressInput }>,
  reply: FastifyReply
) => {
  try {
    const updated = await updateAddress(request.params.id, request.body);

    return reply.code(200).send({
      message: "Address updated successfully",
      address: updated,
    });
  } catch (error: any) {
    logError(error?.message);
    return handleError(error, reply);
  }
};

// Delete
export const deleteAddressController = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) => {
  try {
    await deleteAddress(request.params.id);

    return reply.code(200).send({
      message: "Address deleted successfully",
      success: true,
    });
  } catch (error: any) {
    logError(error?.message);
    return handleError(error, reply);
  }
};

// Aggregate
export const getAllAddressesWithPincodeController = async (
  request: FastifyRequest<{ Querystring: GetAllAddressesQuery }>,
  reply: FastifyReply
) => {
  try {
    const result = await getAllAddressesWithPincode(request.query.pincode);

    if (request.query.pincode && result.addresses.length === 0) {
      return sendError(reply, "No addresses found for this pincode", 404);
    }

    return reply.code(200).send(result);
  } catch (error: any) {
    logError(error?.message);
    return handleError(error, reply);
  }
};
