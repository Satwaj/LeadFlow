import { Router } from "express";
import {
  activity,
  addNote,
  assign,
  createLead,
  getLead,
  getLeads,
  updateStatus,
} from "../controllers/lead.controller.js";
import { requestLead } from "../controllers/leadRequest.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  assignLeadSchema,
  createLeadSchema,
  createNoteSchema,
  leadIdParamSchema,
  listLeadsSchema,
  updateStatusSchema,
} from "../validators/lead.schema.js";

const router = Router();

router.post("/", validate(createLeadSchema), createLead);
router.get("/", authenticate, validate(listLeadsSchema), getLeads);
router.get("/:id", authenticate, validate(leadIdParamSchema), getLead);
router.post("/:id/request", authenticate, validate(leadIdParamSchema), requestLead);
router.patch("/:id/status", authenticate, validate(updateStatusSchema), updateStatus);
router.patch("/:id/assign", authenticate, authorizeRoles("admin"), validate(assignLeadSchema), assign);
router.post("/:id/notes", authenticate, validate(createNoteSchema), addNote);
router.get("/:id/activity", authenticate, validate(leadIdParamSchema), activity);

export default router;
