import { Router } from "express";
import authRoutes from "./auth.routes.js";
import leadRoutes from "./lead.routes.js";
import leadRequestRoutes from "./leadRequest.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/leads", leadRoutes);
router.use("/lead-requests", leadRequestRoutes);

export default router;
