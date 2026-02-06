import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// All order routes are protected
router.use(protect);

router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrder);

export default router;
