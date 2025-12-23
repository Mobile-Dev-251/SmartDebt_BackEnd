import { getAllUsers } from "../controllers/userController.js";
import express from "express";

const router = express.Router();
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Lấy danh sách người dùng thành công
 *       400:
 *         description: Lỗi không tìm thấy người dùng
 */
router.get("/", getAllUsers);

export default router;
