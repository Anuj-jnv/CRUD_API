import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  createUserSchema,
  createUserResponseSchema,
  updateUserSchema,
  updateUserResponseSchema,
  deleteUserResponseSchema,
  getAllUsersResponseSchema,
  getUserResponseSchema,
  getAllUsersWithAddressesResponseSchema,
  idParamSchema,
} from "../schemas/user.schema.js";

import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getAllUsersWithAddressesController,
} from "../controllers/user.controller.js";

const userRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post(
    "/users",
    {
      schema: {
        body: createUserSchema,
        response: {
          201: createUserResponseSchema,
        },
        description: "Create a new user",
        tags: ["Users"],
      },
    },
    createUserController,
  );

  app.get(
    "/users",
    {
      schema: {
        response: {
          200: getAllUsersResponseSchema,
        },
        description: "Fetch all users",
        tags: ["Users"],
      },
    },
    getAllUsersController,
  );

  app.get(
    "/users/:id",
    {
      schema: {
        params: idParamSchema,
        response: {
          200: getUserResponseSchema,
        },
        description: "Get a user by ID",
        tags: ["Users"],
      },
    },
    getUserByIdController,
  );

  app.put(
    "/users/:id",
    {
      schema: {
        params: idParamSchema,
        body: updateUserSchema,
        response: {
          200: updateUserResponseSchema,
        },
        description: "Update a user",
        tags: ["Users"],
      },
    },
    updateUserController,
  );

  app.get(
    "/users/aggregate",
    {
      schema: {
        response: {
          200: getAllUsersWithAddressesResponseSchema,
        },
        description: "Fetch users with nested addresses",
        tags: ["Users"],
      },
    },
    getAllUsersWithAddressesController,
  );

  app.delete(
    "/users/:id",
    {
      schema: {
        params: idParamSchema,
        response: {
          200: deleteUserResponseSchema,
        },
        description: "Delete a user",
        tags: ["Users"],
      },
    },
    deleteUserController,
  );
};

export default userRoutes;
