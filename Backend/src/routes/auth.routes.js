import { Router } from "express";
import { createUser, login, logout, me, register, users } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createUserSchema, loginSchema, publicRegisterSchema } from "../validators/auth.schema.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);
router.get("/users", authenticate, authorizeRoles("admin"), users);
router.post("/register", validate(publicRegisterSchema), register);
router.post("/users", authenticate, authorizeRoles("admin"), validate(createUserSchema), createUser);

export default router;
