import {
  createNewGroupService,
  getGroupMembersService,
  getMyGroupsService,
  createExpenseForGroupService,
  addMemberToGroupService,
  getGroupHistoryExpensesService,
  leaveGroupService,
} from "../services/groupService.js";
import sql from "../config/db.js";

export const createNewGroup = async (req, res) => {
  try {
    const data = req.body;
    const id = req.user.id;
    const result = await createNewGroupService(id, data);
    return res.status(result.status).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error.message || 'Bad request',
    });
  }
};

export const createExpenseInGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const data = req.body;

    // Gọi service xử lý logic
    const result = await createExpenseForGroupService(userId, groupId, data);

    // Trả về kết quả kèm danh sách nợ (created_debts)
    return res.status(result.status).json({
      message: result.message,
      expense_id: result.expense_id,
      created_debts: result.created_debts 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const id = req.user.id;
    const result = await getMyGroupsService(id);
    if (result.status === 200)
      return res.status(result.status).json(result.data);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error.message || 'Bad request',
    });
  }
};

export const groupMembers = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const result = await getGroupMembersService(groupId);
    if (result.status === 200) {
      return res.status(result.status).json(result.data);
    } else {
      return res.status(result.status).json({
        message: result.message,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error.message || 'Bad request',
    });
  }
};

export const addMemberToGroup = async (req, res) => {
  try {
    const data = req.body;
    const groupId = req.params.groupId;
    const result = await addMemberToGroupService(groupId, data);
    if (result.status === 200) {
      return res.status(result.status).json({
        message: result.message,
      });
    } else {
      return res.status(result.status).json({
        message: result.message,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    // Call service to leave group
    const result = await leaveGroupService(userId, groupId);
    return res.status(result.status).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error.message || 'Bad request',
    });
  }
};

export const getGroupExpenseDetail = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const userId = req.user.id;

    // Validate expenseId
    if (!expenseId || isNaN(expenseId)) {
      return res.status(400).json({
        error: 'Invalid expense ID',
      });
    }

    console.log('Fetching group expense detail for expenseId:', expenseId, 'userId:', userId);

    // Get expense details with payer name
    const expense = await sql`
      SELECT ge.*, g.name as group_name, u.name as payer_name
      FROM group_expenses ge
      JOIN groups g ON ge.group_id = g.id
      JOIN users u ON ge.payer_id = u.id
      WHERE ge.id = ${expenseId}
    `;

    console.log('Expense query result:', expense);

    if (expense.length === 0) {
      return res.status(404).json({
        message: "Group expense not found",
      });
    }

    const expenseData = expense[0];

    // Get all debts for this expense with borrower names
    const debts = await sql`
      SELECT d.*, u.name as borrower_name, u.avatar_url
      FROM debts d
      JOIN users u ON d.borrower_id = u.id
      WHERE d.group_expense_id = ${expenseId}
      ORDER BY d.status, u.name
    `;

    // Check if user is payer or borrower
    console.log('Debts query result (Đã chia chưa?):', debts);
    const isPayer = expenseData.payer_id === userId;
    const userDebt = debts.find(debt => debt.borrower_id === userId);

    return res.status(200).json({
      expense: expenseData,
      debts: debts,
      userRole: isPayer ? 'payer' : userDebt ? 'borrower' : 'none',
      userDebt: userDebt || null
    });
  } catch (error) {
    console.error('Error in getGroupExpenseDetail:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
};

export const getGroupHistoryExpenses = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const result = await getGroupHistoryExpensesService(groupId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getGroupHistoryExpenses:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
};
