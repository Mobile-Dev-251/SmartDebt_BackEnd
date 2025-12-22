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

router.get("/debts", getAllDebts);
router.get("/debts/:id", getDebtById);
router.post("/debts", createDebt);
router.put("/debts/:id", updateDebt);
router.delete("/debts/:id", deleteDebt);
router.patch("/debts/:id/mark-paid", markDebtAsPaid);
router.get("/debts/:id/payments", getDebtPayments);
router.post("/debts/:id/payments", createDebtPayment);

export default router;
