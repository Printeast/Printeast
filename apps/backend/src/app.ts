import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import pino from "pino-http";
import cookieParser from "cookie-parser";
import compression from "compression";
import { env } from "./config/env";
import { apiLimiter } from "./middleware/rate-limit.middleware";
import { isolationMiddleware } from "./middleware/isolation.middleware";
import { globalErrorHandler } from "./middleware/error.middleware";
import { AppError } from "./utils/app-error";
import authRoutes from "./routes/auth.routes";
import storageRoutes from "./routes/storage.routes";
import analyticsRoutes from "./routes/analytics.routes";
import orderRoutes from "./routes/order.routes";

const app: Application = express();

app.use(compression());
app.use(helmet());
app.use(cors({
  origin: env.ALLOWED_ORIGINS.split(",").map(o => o.trim()).filter(Boolean),
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(pino());

app.use(isolationMiddleware); // Inject Tenant Context "The Brain"

app.use("/api", apiLimiter);

app.get("/health", (_, res) =>
  res.status(200).json({ status: "ok", uptime: process.uptime() }),
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/storage", storageRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/orders", orderRoutes);

app.all("*", (req, _, next) =>
  next(new AppError(`Route ${req.originalUrl} not found`, 404)),
);

app.use(globalErrorHandler);

export default app;
