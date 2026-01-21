import { Router } from "express";
import * as storageController from "../controllers/storage.controller";
import { protect } from "../middleware/auth.middleware";

const router: Router = Router();

// Only authenticated users can request signed URLs for design uploads
router.post("/sign", protect, storageController.getSignedUrl);

export default router;
