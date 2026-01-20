import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateUserInput,
  UpdateUserInput,
} from "../schemas/user.schema.js";

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsersWithAddress,
} from "../services/user.service.js";

import { sendError, handleError } from "../utils/response.js";
import { logError, logInfo } from "../utils/logger.js";

// Create User
export const createUserController = async (
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) => {
  try {
    const user = await createUser(request.body);

    logInfo(`User created -> ${user.id}`);

    return reply.code(201).send({
      message: "User created successfully",
      user,
    });
  } catch (error: any) {
    logError(error?.message);
    return handleError(error, reply);
  }
};

// Get All Users
export const getAllUsersController = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const users = await getAllUsers();

    return reply.code(200).send({
      users,
      total: users.length,
    });
  } catch (error: any) {
    logError(error?.message);
    return handleError(error, reply);
  }
};

// Get User by ID
export const getUserByIdController = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) => {
  try {
    const user = await getUserById(request.params.id);

    if (!user) return sendError(reply, "User not found", 404);

    return reply.code(200).send({ user });
  } catch (error: any) {
    logError(error?.message);
    return handleError(error, reply);
  }
};

// Update User
export const updateUserController = async (
  request: FastifyRequest<{ Params: { id: number }; Body: UpdateUserInput }>,
  reply: FastifyReply
) => {
  try {
    const user = await updateUser(request.params.id, request.body);

    return reply.code(200).send({
      message: "User updated successfully",
      user,
    });
  } catch (error: any) {
    logError(error?.message);
    return handleError(error, reply);
  }
};

// Delete User
export const deleteUserController = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) => {
  try {
    await deleteUser(request.params.id);

    return reply.code(200).send({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error: any) {
    logError(error?.message);
    return handleError(error, reply);
  }
};

// Get Users with Nested Addresses
export const getAllUsersWithAddressesController = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const result = await getAllUsersWithAddress();

    return reply.code(200).send(result);
  } catch (error: any) {
    logError(error?.message);
    return handleError(error, reply);
  }
};
