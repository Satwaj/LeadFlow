import { Router } from "express";
import {
  approveRequest,
  getRequests,
  getMyRequests,
  rejectRequest,
} from "../controllers/leadRequest.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { leadRequestIdParamSchema } from "../validators/leadRequest.schema.js";

const router = Router();

router.get("/", authenticate, authorizeRoles("admin"), getRequests);
router.get("/me", authenticate, getMyRequests);
router.patch("/:id/approve", authenticate, authorizeRoles("admin"), validate(leadRequestIdParamSchema), approveRequest);
router.patch("/:id/reject", authenticate, authorizeRoles("admin"), validate(leadRequestIdParamSchema), rejectRequest);

export default router;
