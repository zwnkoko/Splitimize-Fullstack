import "tsconfig-paths/register";
import express from "express";
import routes from "./routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth";
import cors from "cors";
import { requireAuth } from "./middleware/require-auth";

const app = express();

// Middleware to handle CORS
// This allows requests from specific origins and methods
app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string],
    credentials: true,
  })
);

// Middleware to handle all auth requests
app.all("/api/auth/{*any}", toNodeHandler(auth));

// Body parser
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Splitimize API",
    version: "1.0.0",
    status: "running",
    timeStamp: new Date().toISOString(),
  });
});

// Protected routes
app.use("/api", requireAuth, routes);

export default app;
