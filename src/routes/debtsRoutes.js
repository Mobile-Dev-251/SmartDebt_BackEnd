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

router.get("/", getAllDebts);
router.get("/:id", getDebtById);
router.post("/", createDebt);
router.put("/:id", updateDebt);
router.delete("/:id", deleteDebt);
router.patch("/:id/mark-paid", markDebtAsPaid);
router.get("/:id/payments", getDebtPayments);
router.post("/:id/payments", createDebtPayment);

export default router;
