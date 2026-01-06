import {
  getAllDebtsService,
  getDebtByIdService,
  createDebtService,
  updateDebtService,
  borrowerConfirmDebtService,
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

export const getDebtById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const debts = await getDebtByIdService(userId, id);
    return res.status(200).send(debts);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error.detail });
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

export const borrowerConfirmDebt = async (req, res) => {
  try {
    const userId = req.user.id;
    const { debtId } = req.params;
    const result = await borrowerConfirmDebtService(userId, debtId);
    return res
      .status(200)
      .send("Debt paid confirmation request sent successfully");
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      error: error.detail,
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
    const userId = req.user.id;
    const { debtId } = req.params;
    const result = await markDebtAsPaidService(userId, debtId);
    return res.status(200).send("Debt marked as paid successfully");
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error.detail,
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
