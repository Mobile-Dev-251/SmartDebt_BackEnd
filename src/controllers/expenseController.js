import {
    getAllExpensesService,
    getExpenseByIdService,
    createExpenseService,
    updateExpenseService,
    deleteExpenseService,
} from "../services/expenseService.js";

export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await getAllExpensesService();
        return res.send(expenses);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getExpenseById = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await getExpenseByIdService(id);
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        return res.send(expense);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createExpense = async (req, res) => {
    try {
        const data = req.body;
        const result = await createExpenseService(data);
        return res.status(201).json({
            expense_id: result,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error.message,
        });
    }
};

export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await updateExpenseService(id, data);
        if (!result) {
            return res.status(404).json({ error: "Expense not found" });
        }
        return res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error.message,
        });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteExpenseService(id);
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};