import Fastify from "fastify";
import { sequelize } from "./config/db.js";
import {
  ZodTypeProvider,
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";

import dotenv from "dotenv";
dotenv.config();

import { logInfo, logError } from "./utils/logger.js";
import userRoutes from "./routes/user.routes.js";
import addressRoutes  from "./routes/address.routes.js";

import swagger from "@fastify/swagger";
import SwaggerUi from "@fastify/swagger-ui";

const app = Fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
async function bootstrap() {
  try {
    await app.register(swagger, {
      openapi: {
        info: {
          title: "My Fastify API",
          description: "API docs",
          version: "1.0.0",
        },
      },
    });
    await app.register(SwaggerUi, {
      routePrefix: "/docs",
      uiConfig: { docExpansion: "list", deepLinking: true },
    });
  } catch (err) {
    console.warn("Swagger registration failed :", err);
  }
}
bootstrap();

app.get("/", () => {
  return { message: "Hello World" };
});
app.register(userRoutes, { prefix: "/api" });
app.register(addressRoutes, { prefix: "/api" });

// write here to check db connection and start server
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logInfo("Database connected successfully");

    const port = Number(process.env.PORT) || 3000;
    await app.listen({ port, host: "0.0.0.0" });
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    logError(`Server failed to start: ${err}`);
    console.error(err);
    process.exit(1);
  }
}
start();