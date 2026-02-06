import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller";
import { cacheMiddleware } from "../middleware/cache.middleware";
import { protect as authenticate } from "../middleware/auth.middleware";

const router: Router = Router();

// Protect all routes
router.use(authenticate);

// GET /stats -> Cached for 60 seconds
// The "Hot Path" - Reads from Redis if available
router.get("/stats", cacheMiddleware(60), analyticsController.getStats);

export default router;
