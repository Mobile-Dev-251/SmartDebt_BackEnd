import express from "express";
import {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
} from "../controllers/contactController.js";

const router = express.Router();

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Lấy danh sách tất cả liên hệ
 *     tags:
 *       - Contact
 *     responses:
 *       200:
 *         description: Lấy danh sách liên hệ thành công
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/", getAllContacts);

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Lấy thông tin liên hệ theo ID
 *     tags:
 *       - Contact
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của liên hệ
 *     responses:
 *       200:
 *         description: Lấy thông tin liên hệ thành công
 *       404:
 *         description: Không tìm thấy liên hệ
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/:id", getContactById);

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Tạo liên hệ mới
 *     tags:
 *       - Contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               note:
 *                 type: string
 *             required:
 *               - name
 *               - phone
 *     responses:
 *       201:
 *         description: Tạo liên hệ thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", createContact);

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Cập nhật thông tin liên hệ
 *     tags:
 *       - Contact
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của liên hệ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               note:
 *                 type: string
 *             required:
 *               - name
 *               - phone
 *     responses:
 *       200:
 *         description: Cập nhật liên hệ thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy liên hệ
 */
router.put("/:id", updateContact);

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Xóa liên hệ
 *     tags:
 *       - Contact
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của liên hệ
 *     responses:
 *       204:
 *         description: Xóa liên hệ thành công
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete("/:id", deleteContact);


export default router;
