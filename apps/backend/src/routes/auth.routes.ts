import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
import { loginLimiter } from "../middleware/rate-limit.middleware";

const router: Router = Router();

router.post("/magic-link", loginLimiter, authController.requestMagicLink);
router.post("/verify", authController.verifyMagicLink);
router.get("/me", protect, authController.getMe);
router.get("/onboard-status", protect, authController.checkOnboardingStatus);
router.post("/onboard", protect, authController.onboard);
router.post("/logout", authController.logout);



export default router;
