import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import pino from "pino-http";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { apiLimiter } from "./middleware/rate-limit.middleware";
import { globalErrorHandler } from "./middleware/error.middleware";
import { AppError } from "./utils/app-error";
import authRoutes from "./routes/auth.routes";
import storageRoutes from "./routes/storage.routes";

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: env.ALLOWED_ORIGINS.split(","), credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(pino());

app.use("/api", apiLimiter);

app.get("/health", (_, res) =>
  res.status(200).json({ status: "ok", uptime: process.uptime() }),
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/storage", storageRoutes);

app.all("*", (req, _, next) =>
  next(new AppError(`Route ${req.originalUrl} not found`, 404)),
);

app.use(globalErrorHandler);

export default app;
