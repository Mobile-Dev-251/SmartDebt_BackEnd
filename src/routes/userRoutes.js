import { getAllUsers, updatePushToken } from "../controllers/userController.js";
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

/**
 * @swagger
 * /users/update-push-token:
 *   post:
 *     summary: Cập nhật push token cho người dùng
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cập nhật push token thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/update-push-token", verifyToken, updatePushToken)
export default router;
