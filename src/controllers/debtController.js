import {
    getAllDebtsService,
    createDebtService,
    updateDebtService,
    deleteDebtService,
    markDebtAsPaidService,
    getPaymentsForDebtService,
    createPaymentForDebtService,
} from "../services/debtService.js";

export const getAllDebts = async (req, res) => {
  try {
    const userId = req.user.id;
    const debts = await getAllDebtsService(userId);
    return res.send(debts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const createDebt = async (req, res) => {
    try {
        const data = req.body;
        const userId = req.user.id;
        const result = await createDebtService(userId, data);
        return res.status(201).json({
            debt_id: result,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error.message,
        });
    }
};

export const updateDebt = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await updateDebtService(id, data);
        if (!result) {
            return res.status(404).json({ error: "Debt not found" });
        }
        return res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error.message,
        });
    }
};

export const deleteDebt = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteDebtService(id);
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const markDebtAsPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await markDebtAsPaidService(id);
        if (!result) {
            return res.status(404).json({ error: "Debt not found" });
        }
        return res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error.message,
        });
    }
};

export const getDebtPayments = async (req, res) => {
    try {
        const { id } = req.params;
        const payments = await getPaymentsForDebtService(id);
        return res.send(payments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createDebtPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await createPaymentForDebtService(id, data);
        return res.status(201).json({
            payment_id: result,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error.message,
        });
    }
};