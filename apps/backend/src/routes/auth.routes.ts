import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { loginLimiter } from "../middleware/rate-limit.middleware";

const router: Router = Router();

router.post("/register", authController.register);
router.post("/login", loginLimiter, authController.login);
router.post("/logout", authController.logout);

export default router;
