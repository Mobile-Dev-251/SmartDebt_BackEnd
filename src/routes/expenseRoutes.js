import express from "express";
import {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Lấy tất cả chi phí
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: Danh sách chi phí
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   category_id:
 *                     type: integer
 *                   amount:
 *                     type: number
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/", getAllExpenses);

/**
 * @swagger
 * /expenses/{id}:
 *   get:
 *     summary: Lấy chi phí theo ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID chi phí
 *     responses:
 *       200:
 *         description: Dữ liệu chi phí
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Không tìm thấy chi phí
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/:id", getExpenseById);

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Tạo chi phí mới
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *                 description: ID danh mục
 *               amount:
 *                 type: number
 *                 description: Số tiền chi phí
 *               description:
 *                 type: string
 *                 description: Mô tả chi phí
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Ngày chi phí
 *             required:
 *               - category_id
 *               - amount
 *               - description
 *               - date
 *     responses:
 *       201:
 *         description: Tạo chi phí thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expense_id:
 *                   type: integer
 *                   description: ID chi phí đã tạo
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post("/", createExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     summary: Cập nhật chi phí
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID chi phí
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *                 description: ID danh mục
 *               amount:
 *                 type: number
 *                 description: Số tiền chi phí
 *               description:
 *                 type: string
 *                 description: Mô tả chi phí
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Ngày chi phí
 *             required:
 *               - category_id
 *               - amount
 *               - description
 *               - date
 *     responses:
 *       200:
 *         description: Cập nhật chi phí thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Không tìm thấy chi phí
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put("/:id", updateExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Xóa chi phí
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID chi phí
 *     responses:
 *       204:
 *         description: Xóa chi phí thành công
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete("/:id", deleteExpense);

export default router;