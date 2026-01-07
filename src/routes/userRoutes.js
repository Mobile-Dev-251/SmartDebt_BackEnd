import {
  getMyProfile,
  getMyNotifications,
  updateMyInfo,
  updatePushToken,
  searchUserByPhone,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/userController.js";
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();
/**
 * @swagger
 * /users/my-profile:
 *   get:
 *     summary: Lấy thông tin người dùng
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
 *       400:
 *         description: Lỗi không tìm thấy người dùng
 */
router.get("/my-profile", verifyToken, getMyProfile);

/**
 * @swagger
 * /users/my-notifications:
 *   get:
 *     summary: Lấy tất cả thông báo của người dùng
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy tất cả thông báo của người dùng thành công
 *       400:
 *         description: Lỗi không tìm thấy thong báo
 */
router.get("/my-notifications", verifyToken, getMyNotifications);

/**
 * @swagger
 * /users/update-my-info:
 *   put:
 *     summary: Cập nhật thông tin người dùng
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               balance:
 *                 type: number
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thông tin người dùng thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.put("/update-my-info", verifyToken, updateMyInfo);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Tìm người dùng theo số điện thoại
 *     description: Tìm user theo số điện thoại
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *           example: "0234567890"
 *         description: Số điện thoại cần tìm
 *     responses:
 *       200:
 *         description: Danh sách user phù hợp
 *       400:
 *         description: Không tim thấy số điện thoại
 *       500:
 *         description: Lỗi server
 */
router.get("/search", verifyToken, searchUserByPhone);

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
router.post("/update-push-token", verifyToken, updatePushToken);

/**
 * @swagger
 * /users/mark-notification-read/{id}:
 *   put:
 *     summary: Đánh dấu thông báo đã đọc
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy thông báo
 */

/**
 * @swagger
 * /users/mark-all-notifications-read:
 *   put:
 *     summary: Đánh dấu tất cả thông báo đã đọc
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.put("/mark-notification-read/:id", verifyToken, markNotificationAsRead);

router.put("/mark-all-notifications-read", verifyToken, markAllNotificationsAsRead);

export default router;
