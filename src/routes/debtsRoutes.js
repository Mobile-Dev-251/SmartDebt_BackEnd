import express from "express";
import {
    getAllDebts,
    getDebtById,
    createDebt,
    updateDebt,
    deleteDebt,
    markDebtAsPaid,
    getDebtPayments,
    createDebtPayment,
} from "../controllers/debtController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Debt:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID nợ
 *         contact_id:
 *           type: integer
 *           description: ID liên hệ
 *         type:
 *           type: string
 *           description: "Loại nợ (ví dụ: nợ phải trả, nợ phải thu)"
 *         title:
 *           type: string
 *           description: Tiêu đề nợ
 *         amount:
 *           type: number
 *           description: Số tiền nợ
 *         due_date:
 *           type: string
 *           format: date
 *           description: Ngày đáo hạn
 *         note:
 *           type: string
 *           description: Ghi chú bổ sung
 *         is_paid:
 *           type: boolean
 *           description: Nợ đã thanh toán chưa
 *       required:
 *         - id
 *         - contact_id
 *         - type
 *         - title
 *         - amount
 *         - due_date
 *         - is_paid
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID thanh toán
 *         debt_id:
 *           type: integer
 *           description: ID nợ
 *         amount:
 *           type: number
 *           description: Số tiền thanh toán
 *         note:
 *           type: string
 *           description: Ghi chú bổ sung
 *       required:
 *         - id
 *         - debt_id
 *         - amount
 */

/**
 * @swagger
 * /debts:
 *   get:
 *     summary: Lấy tất cả nợ
 *     tags: [Debts]
 *     responses:
 *       200:
 *         description: Danh sách nợ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Debt'
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/", getAllDebts);

/**
 * @swagger
 * /debts/{id}:
 *   get:
 *     summary: Lấy nợ theo ID
 *     tags: [Debts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nợ
 *     responses:
 *       200:
 *         description: Dữ liệu nợ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Debt'
 *       404:
 *         description: Không tìm thấy nợ
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/:id", getDebtById);

/**
 * @swagger
 * /debts:
 *   post:
 *     summary: Tạo nợ mới
 *     tags: [Debts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contact_id:
 *                 type: integer
 *                 description: ID liên hệ
 *               type:
 *                 type: string
 *                 description: Loại nợ
 *               title:
 *                 type: string
 *                 description: Tiêu đề nợ
 *               amount:
 *                 type: number
 *                 description: Số tiền nợ
 *               due_date:
 *                 type: string
 *                 format: date
 *                 description: Ngày đáo hạn
 *               note:
 *                 type: string
 *                 description: Ghi chú bổ sung
 *             required:
 *               - contact_id
 *               - type
 *               - title
 *               - amount
 *               - due_date
 *     responses:
 *       201:
 *         description: Tạo nợ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 debt_id:
 *                   type: integer
 *                   description: ID nợ đã tạo
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post("/", createDebt);

/**
 * @swagger
 * /debts/{id}:
 *   put:
 *     summary: Cập nhật nợ
 *     tags: [Debts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nợ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contact_id:
 *                 type: integer
 *                 description: ID liên hệ
 *               type:
 *                 type: string
 *                 description: Loại nợ
 *               title:
 *                 type: string
 *                 description: Tiêu đề nợ
 *               amount:
 *                 type: number
 *                 description: Số tiền nợ
 *               due_date:
 *                 type: string
 *                 format: date
 *                 description: Ngày đáo hạn
 *               note:
 *                 type: string
 *                 description: Ghi chú bổ sung
 *             required:
 *               - contact_id
 *               - type
 *               - title
 *               - amount
 *               - due_date
 *     responses:
 *       200:
 *         description: Cập nhật nợ thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Debt'
 *       404:
 *         description: Không tìm thấy nợ
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put("/:id", updateDebt);

/**
 * @swagger
 * /debts/{id}:
 *   delete:
 *     summary: Xóa nợ
 *     tags: [Debts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nợ
 *     responses:
 *       204:
 *         description: Xóa nợ thành công
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete("/:id", deleteDebt);

/**
 * @swagger
 * /debts/{id}/mark-paid:
 *   patch:
 *     summary: Đánh dấu nợ đã thanh toán
 *     tags: [Debts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nợ
 *     responses:
 *       200:
 *         description: Nợ đã được đánh dấu thanh toán
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Debt'
 *       404:
 *         description: Không tìm thấy nợ
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.patch("/:id/mark-paid", markDebtAsPaid);

/**
 * @swagger
 * /debts/{id}/payments:
 *   get:
 *     summary: Lấy thanh toán cho nợ
 *     tags: [Debts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nợ
 *     responses:
 *       200:
 *         description: Danh sách thanh toán
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/:id/payments", getDebtPayments);

/**
 * @swagger
 * /debts/{id}/payments:
 *   post:
 *     summary: Tạo thanh toán cho nợ
 *     tags: [Debts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nợ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Số tiền thanh toán
 *               note:
 *                 type: string
 *                 description: Ghi chú bổ sung
 *             required:
 *               - amount
 *     responses:
 *       201:
 *         description: Tạo thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment_id:
 *                   type: integer
 *                   description: ID thanh toán đã tạo
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post("/:id/payments", createDebtPayment);

export default router;
