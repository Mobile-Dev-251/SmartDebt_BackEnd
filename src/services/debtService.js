import sql from "../config/db.js";
import { createContactService } from "./contactService.js";
export const getAllDebtsService = async () => {
  const result = await sql`SELECT * FROM debts`;
  return result;
};

export const getDebtByIdService = async (id) => {
  const result = await sql`SELECT * FROM debts WHERE id = ${id}`;
  return result[0];
};

export const createDebtService = async (userId, data) => {
  try {
    const {
      borrower_id,
      type,
      title,
      amount,
      due_date,
      remind_before,
      note,
      isSaved,
    } = data;
    const result = await sql`
      INSERT INTO debts (lender_id, borrower_id, type, title, amount, due_date, remind_before, note)
      VALUES (${userId}, ${borrower_id}, ${type}, ${title}, ${amount}, ${due_date}, ${remind_before}, ${note})
      RETURNING id;
    `;
    if (isSaved) {
      await createContactService(userId, borrower_id);
    }

    return result[0].id;
  } catch (error) {
    console.error("Error creating debt:", error);
    throw error;
  }
};

export const updateDebtService = async (id, data) => {
    //TODO: due_date : dayjs
    try {
        const { contact_id, type, title, amount, due_date, note } = data;
        const result = await sql`
      UPDATE debts
      SET contact_id = ${contact_id}, type = ${type}, title = ${title}, amount = ${amount}, due_date = ${due_date}, note = ${note}
      WHERE id = ${id}
      RETURNING *;
    `;
        return result[0];
    } catch (error) {
        console.error("Error updating debt:", error);
        throw error;
    }
};

export const deleteDebtService = async (id) => {
    try {
        await sql`DELETE FROM debts WHERE id = ${id}`;
        return true;
    } catch (error) {
        console.error("Error deleting debt:", error);
        throw error;
    }
};

export const markDebtAsPaidService = async (id) => {
    try {
        const result = await sql`
      UPDATE debts
      SET is_paid = true
      WHERE id = ${id}
      RETURNING *;
    `;
        return result[0];
    } catch (error) {
        console.error("Error marking debt as paid:", error);
        throw error;
    }
};

export const getPaymentsForDebtService = async (debtId) => {
    const result = await sql`SELECT * FROM payments WHERE debt_id = ${debtId}`;
    return result;
};

export const createPaymentForDebtService = async (debtId, data) => {
    try {
        const { amount, note } = data;
        const result = await sql`
      INSERT INTO payments (debt_id, amount, note)
      VALUES (${debtId}, ${amount}, ${note})
      RETURNING id;
    `;
        return result[0].id;
    } catch (error) {
        console.error("Error creating payment:", error);
        throw error;
    }
};