import express from "express";
import {
  getAllContacts,
  deleteContact,
} from "../controllers/contactController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Lấy thông tin liên hệ theo ID
 *     tags:
 *       - Contact
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin liên hệ thành công
 *       404:
 *         description: Không tìm thấy liên hệ
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/", verifyToken, getAllContacts);

// /**
//  * @swagger
//  * /contacts:
//  *   post:
//  *     summary: Tạo liên hệ mới
//  *     tags:
//  *       - Contact
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               phone:
//  *                 type: string
//  *               note:
//  *                 type: string
//  *             required:
//  *               - name
//  *               - phone
//  *     responses:
//  *       201:
//  *         description: Tạo liên hệ thành công
//  *       400:
//  *         description: Dữ liệu không hợp lệ
//  */
// router.post("/", createContact);

/**
 * @swagger
 * /contacts/{deleteId}:
 *   delete:
 *     summary: Xóa liên hệ
 *     tags:
 *       - Contact
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deleteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của liên hệ
 *     responses:
 *       204:
 *         description: Xóa liên hệ thành công
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete("/:deleteId", verifyToken, deleteContact);


export default router;
