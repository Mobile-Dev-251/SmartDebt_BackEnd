import { getAllUsers } from "../controllers/userController.js";
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách người dùng thành công
 *       400:
 *         description: Lỗi không tìm thấy người dùng
 */
router.get("/", verifyToken, getAllUsers);

export default router;
