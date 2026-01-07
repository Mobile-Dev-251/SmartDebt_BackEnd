import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createNewGroup,
  groupMembers,
  getMyGroups,
  addMemberToGroup,
  getGroupHistoryExpenses,
  createExpenseInGroup,
  leaveGroup,
  getGroupExpenseDetail,
} from "../controllers/groupController.js";
import { createExpense } from "../controllers/expenseController.js";
const router = express.Router();

/**
 * @swagger
 * /groups/create-new-group:
 *   post:
 *     summary: Tạo nhóm mới
 *     description: |
 *       Tạo nhóm mới.
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - members
 *             properties:
 *               name:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Tạo nhóm thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 */
router.post("/create-new-group", verifyToken, createNewGroup);

/**
 * @swagger
 * /groups/my-groups:
 *   get:
 *     summary: Lấy danh sách nhóm của người dùng
 *     description: |
 *       Lấy danh sách nhóm của người dùng.
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách nhóm của người dùng thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 */
router.get("/my-groups", verifyToken, getMyGroups);

/**
 * @swagger
 * /groups/{groupId}/members:
 *   get:
 *     summary: Lấy danh sách thành viên nhóm
 *     description: |
 *       Lấy danh sách thành viên nhóm.
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của nhóm
 *     responses:
 *       200:
 *         description: Lấy danh sách thành viên nhóm thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 */
router.get("/:groupId/members", groupMembers);

/**
 * @swagger
 * /groups/add-member/{groupId}:
 *   post:
 *     summary: Thêm thành viên vào nhóm
 *     description: Thêm thành viên vào nhóm.
 *     tags:
 *       - Groups
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - members
 *             properties:
 *               members:
 *                 type: array
 *                 items:
 *                   type: integer
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của nhóm
 *     responses:
 *       200:
 *         description: Thêm thành viên vào nhóm thành công
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post("/add-member/:groupId", addMemberToGroup);

/**
 * @swagger
 * /groups/{groupId}/create-expense:
 *   post:
 *     summary: Tạo khoản chi tiêu cho nhóm
 *     description: Tạo khoản chi tiêu mới. Số tiền sẽ được chia đều cho danh sách involved_members.
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của nhóm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - totalAmount
 *               - due_date
 *               - payer_id
 *               - involved_members
 *             properties:
 *               totalAmount:
 *                 type: number
 *                 description: Tổng số tiền chi tiêu
 *               due_date:
 *                 type: string
 *                 format: date
 *               remind_before:
 *                 type: integer
 *                 description: Thời gian nhắc nhở trước ngày đáo hạn (phút)
 *               payer_id:
 *                 type: integer
 *                 description: ID của người trả tiền
 *               involved_members:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Danh sách ID các thành viên tham gia chia tiền
 *     responses:
 *       200:
 *         description: Tạo khoản chi tiêu cho nhóm thành công
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post("/:groupId/create-expense", verifyToken, createExpenseInGroup);

/**
 * @swagger
 * /groups/leave-group/{groupId}:
 *   delete:
 *     summary: Rời khỏi nhóm
 *     description: Rời khỏi nhóm.
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của nhóm
 *     responses:
 *       200:
 *         description: Rời khỏi nhóm thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 */
router.delete("/leave-group/:groupId", verifyToken, leaveGroup);

/**
 * @swagger
 * /groups/{groupId}/history-expenses:
 *   get:
 *     summary: Lấy lịch sử chi tiêu của nhóm
 *     description: Lấy lịch sử chi tiêu của nhóm.
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của nhóm
 *     responses:
 *       200:
 *         description: Lấy lịch sử chi tiêu của nhóm thành công
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/:groupId/history-expenses", getGroupHistoryExpenses);

/**
 * @swagger
 * /groups/expense/{expenseId}:
 *   get:
 *     summary: Lấy chi tiết khoản chi tiêu nhóm
 *     description: Lấy chi tiết khoản chi tiêu nhóm bao gồm danh sách thành viên và trạng thái.
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của khoản chi tiêu
 *     responses:
 *       200:
 *         description: Lấy chi tiết khoản chi tiêu thành công
 *       404:
 *         description: Không tìm thấy khoản chi tiêu
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/expense/:expenseId", verifyToken, getGroupExpenseDetail);

export default router;
