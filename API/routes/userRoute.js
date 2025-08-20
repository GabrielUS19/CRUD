import { Router } from "express";
import userController from "../controllers/userController.js";

const router = Router();

router.patch("/users/update/:id", userController.update_profile_patch);

router.delete("/users/delete/:id", userController.delete_account_delete);

export default router;
