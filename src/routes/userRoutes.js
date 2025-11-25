import express from "express";
import { getAllUsers, createNewUser } from "../controllers/userController.js";
import { handleAuthLogin } from "../controllers/authController.js";
const router = express.Router();

router.get("/users", getAllUsers);
router.post("/login", handleAuthLogin);
router.post("/create-new-user", createNewUser);
export default router;
