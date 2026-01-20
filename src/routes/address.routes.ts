import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  createAddressSchema,
  createAddressResponseSchema,
  updateAddressSchema,
  updateAddressResponseSchema,
  deleteAddressResponseSchema,
  getAllAddressesResponseSchema,
  getAddressResponseSchema,
  getAllAddressesQuerySchema,
  idParamSchema,
} from "../schemas/address.schema.js";

import {
  createAddressController,
  getAllAddressesController,
  getAddressByIdController,
  updateAddressController,
  deleteAddressController,
  getAllAddressesWithPincodeController,
} from "../controllers/address.controller.js";

export default async function addressRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post(
    "/addresses",
    {
      schema: {
        body: createAddressSchema,
        response: {
          201: createAddressResponseSchema,
        },
        description: "Create a new address",
        tags: ["Addresses"],
      },
    },
    createAddressController
  );

  app.get(
    "/addresses",
    {
      schema: {
        querystring: getAllAddressesQuerySchema,
        response: {
          200: getAllAddressesResponseSchema,
        },
        description: "List all addresses (optional filter by pincode)",
        tags: ["Addresses"],
      },
    },
    getAllAddressesController
  );

  app.get(
    "/addresses/:id",
    {
      schema: {
        params: idParamSchema,
        response: {
          200: getAddressResponseSchema,
        },
        description: "Get an address by ID",
        tags: ["Addresses"],
      },
    },
    getAddressByIdController
  );

  app.get(
    "/addresses/aggregate",
    {
      schema: {
        querystring: getAllAddressesQuerySchema,
        response: {
          200: getAllAddressesResponseSchema,
        },
        description: "Aggregate / list addresses (filter by pincode)",
        tags: ["Addresses"],
      },
    },
    getAllAddressesWithPincodeController
  );

  app.put(
    "/addresses/:id",
    {
      schema: {
        params: idParamSchema,
        body: updateAddressSchema,
        response: {
          200: updateAddressResponseSchema,
        },
        description: "Update an address by ID",
        tags: ["Addresses"],
      },
    },
    updateAddressController
  );

  app.delete(
    "/addresses/:id",
    {
      schema: {
        params: idParamSchema,
        response: {
          200: deleteAddressResponseSchema,
        },
        description: "Delete an address by ID",
        tags: ["Addresses"],
      },
    },
    deleteAddressController
  );
}
