import { Router } from "express";
import userController from "../controllers/userController.js";

const router = Router();

router.patch("/users/update/:id", userController.update_patch);

export default router;
