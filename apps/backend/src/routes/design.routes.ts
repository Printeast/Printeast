import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { designController } from "../controllers/design.controller";

const router: Router = Router();

// All routes require authentication
router.use(protect);

// Templates (must be before :id to avoid conflict)
router.get("/templates", designController.getTemplates.bind(designController));

// CRUD operations
router.post("/", designController.createDesign.bind(designController));
router.get("/", designController.getMyDesigns.bind(designController));
router.get("/:id", designController.getDesign.bind(designController));
router.put("/:id", designController.updateDesign.bind(designController));
router.delete("/:id", designController.deleteDesign.bind(designController));

// Duplicate/use template
router.post("/:id/duplicate", designController.duplicateDesign.bind(designController));

export default router;
