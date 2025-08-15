import { Router } from "express";
import authController from "../controllers/authController.js";

const router = Router();

router.post("/auth/signup", authController.signup_post);

router.post("/auth/login", authController.login_post);

router.patch("/auth/update-password/:id", authController.update_password_patch);

export default router;
