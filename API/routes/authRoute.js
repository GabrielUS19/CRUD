import { Router } from "express";
import authController from "../controllers/authController.js";

const router = Router();

router.post("/auth/signup", authController.signup_post);

router.post("/auth/login", authController.login_post);

export default router;
