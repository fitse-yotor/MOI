import express from "express";
import cors from "cors";
import morgan from "morgan";
import apiRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authenticate } from "./middleware/auth.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/auth", authRoutes);
  app.use("/api/public", publicRoutes);
  app.use("/api", authenticate, apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
