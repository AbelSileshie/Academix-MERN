import dotenv from "dotenv";
dotenv.config();
import swaggerUi from "swagger-ui-express";
import { auth, client } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
const app = express();
const PORT = process.env.PORT;
// Swagger/OpenAPI setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Academix API",
      version: "1.0.0",
      description: "Academix backend API documentation",
    },
    servers: [
      { url: "http://localhost:" + PORT }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  apis: ["./src/**/*.ts", "./auth.ts"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);


// Connect to MongoDB before starting the server
async function startServer() {
    // Serve Swagger UI
    app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  try {
    await client.connect();
    console.log("MongoDB connected");



    // Mount Better Auth handler
    app.all("/api/{*any}", toNodeHandler(auth));

    // Health check route

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

startServer();
// Removed conflicting local express() function.

