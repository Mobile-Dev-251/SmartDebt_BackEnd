import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getAllDebts,
  getDebtById,
  createDebt,
  borrowerConfirmDebt,
  markDebtAsPaid,
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

/**
 * @swagger
 * /debts/{id}:
 *   get:
 *     summary: Lấy thông tin nợ theo ID
 *     tags: [Debts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nợ
 *     responses:
 *       200:
 *         description: Lấy thông tin nợ thành công
 *       404:
 *         description: Không tìm thấy nợ
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/:id", verifyToken, getDebtById);

router.put("/:id", updateDebt);

/**
 * @swagger
 * /debts/borrower-confirm/{debtId}:
 *   put:
 *     summary: Xac nhận đã trả nợ bởi người vay
 *     tags: [Debts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: debtId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nợ
 *     responses:
 *       200:
 *         description: Xác nhận trả nợ thành công
 *       404:
 *         description: Không tìm thấy nợ
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put("/borrower-confirm/:debtId", verifyToken, borrowerConfirmDebt);

/**
 * @swagger
 * /debts/mark-paid/{debtId}:
 *   put:
 *     summary: Xac nhận đã trả nợ bởi người cho vay
 *     tags: [Debts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: debtId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nợ
 *     responses:
 *       200:
 *         description: Xác nhận trả nợ thành công
 *       400:
 *         description: Không tìm thấy nợ
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put("/mark-paid/:debtId", verifyToken, markDebtAsPaid);

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
// router.patch("/:id/mark-paid", markDebtAsPaid);
// router.get("/:id/payments", getDebtPayments);
// router.post("/:id/payments", createDebtPayment);

/**
 * @swagger
 * components:
 *   schemas:
 *     DebtResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         lender_id:
 *           type: integer
 *         borrower_id:
 *           type: integer
 *         status:
 *           type: string
 *         title:
 *           type: string
 *         amount:
 *           type: number
 *         note:
 *           type: string
 *         due_date:
 *           type: string
 *           format: date
 *         remind_before:
 *           type: integer
 */
export default router;
