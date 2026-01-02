import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getAllDebts,
  createDebt,
  updateDebt,
  deleteDebt,
} from "../controllers/debtController.js";

const router = express.Router();

/**
 * @swagger
 * /debts:
 *   get:
 *     summary: Lấy tất cả các khoản nợ/cho vay của người dùng
 *     description: |
 *       Lấy danh sách tất cả các khoản nợ và cho vay liên quan đến người dùng.
 *     tags:
 *       - Debts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin khoản nợ/cho vay thành công
 *       404:
 *         description: Không tìm thấy khoản nợ/cho vay
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/", verifyToken, getAllDebts);

/**
 * @swagger
 * /debts:
 *   post:
 *     summary: Tạo một khoản nợ mới
 *     description: |
 *       Tạo khoản nợ mới.
 *     tags:
 *       - Debts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - borrower_id
 *               - amount
 *               - due_date
 *             properties:
 *               borrower_id:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [Ăn uống, Học tập, Sinh hoạt, Khác]
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *                 format: float
 *               due_date:
 *                 type: string
 *                 format: date
 *               remind_before:
 *                 type: integer
 *                 description: Số ngày trước hạn để nhắc nhở
 *               note:
 *                 type: string
 *               isSaved:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tạo khoản nợ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 */
router.post("/", verifyToken, createDebt);
router.put("/:id", updateDebt);
router.delete("/:id", deleteDebt);
// router.patch("/:id/mark-paid", markDebtAsPaid);
// router.get("/:id/payments", getDebtPayments);
// router.post("/:id/payments", createDebtPayment);

export default router;
