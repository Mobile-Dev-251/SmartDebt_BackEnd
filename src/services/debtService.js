import sql from "../config/db.js";
import { Expo } from "expo-server-sdk";
import { createContactService } from "./contactService.js";

let expo = new Expo();

export const getAllDebtsService = async (userId) => {
  const result =
    await sql`SELECT d.*, d.amount as debt_amount, COALESCE(ge.total_amount, d.amount) as amount, b.name as borrower_name, l.name as lender_name FROM debts d LEFT JOIN group_expenses ge ON d.group_expense_id = ge.id JOIN users b ON d.borrower_id = b.id JOIN users l ON d.lender_id = l.id WHERE d.lender_id = ${userId} OR d.borrower_id = ${userId} ORDER BY d.created_at DESC`;
  return result;
};

export const getDebtByIdService = async (userId, debtId) => {
  const result =
    await sql`SELECT d.*, COALESCE(ge.total_amount, d.amount) as amount, b.name as borrower_name, l.name as lender_name FROM debts d LEFT JOIN group_expenses ge ON d.group_expense_id = ge.id JOIN users b ON d.borrower_id = b.id JOIN users l ON d.lender_id = l.id WHERE (d.lender_id = ${userId} OR d.borrower_id = ${userId}) AND d.id = ${debtId}`;
  if (result.length === 0) {
    throw new Error("Debt not found or you do not have access to it");
  }
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

    // Xác định lender và borrower dựa trên type
    let finalLenderId, finalBorrowerId;
    if (type === 'muon') {
      // "Mượn nợ": Người tạo là borrower, borrower_id (target) là lender
      finalLenderId = borrower_id;
      finalBorrowerId = userId;
    } else if (type === 'cho_muon') {
      // "Cho mượn": Người tạo là lender, borrower_id (target) là borrower
      finalLenderId = userId;
      finalBorrowerId = borrower_id;
    } else {
      // Default: userId là lender
      finalLenderId = userId;
      finalBorrowerId = borrower_id;
    }

    const result = await sql`
      INSERT INTO debts (lender_id, borrower_id, type, title, amount, due_date, remind_before, note)
      VALUES (${finalLenderId}, ${finalBorrowerId}, ${type}, ${title}, ${amount}, ${due_date}, ${remind_before}, ${note})
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

export const borrowerConfirmDebtService = async (userId, debtId) => {
  try {
    const debt =
      await sql`SELECT d.borrower_id, d.lender_id, d.amount, borrower.name, lender.expo_push_token  FROM "debts" d JOIN "users" borrower ON d.borrower_id = borrower.id JOIN "users" lender ON d.lender_id = lender.id WHERE d.id = ${debtId} AND d.borrower_id = ${userId} AND d.status = 'OPEN'`;
    if (debt.length === 0) {
      throw new Error("Debt not found or you do not have access to it");
    }
    const message = {
      to: debt[0].expo_push_token,
      title: "Smart Debt - Thông báo xác nhận trả nợ",
      body: `${debt[0].name} xác nhận đã trả khoản nợ ${debt[0].amount} đồng cho bạn`,
      data: {
        debtId: debtId,
        screen: "wallet",
        receiveId: debt[0].lender_id,
      },
    };
    await sql`
            UPDATE "debts" 
            SET status = 'PENDING_CONFIRMATION_BY_LENDER' 
            WHERE id = ${debtId}
        `;
    try {
      let tickets = await expo.sendPushNotificationsAsync([message]);
      console.log("Push notification sent:", tickets);
    } catch (pushError) {
      console.warn("Failed to send push notification:", pushError);
      // Don't throw, continue with notification insert
    }
    await sql`
            INSERT INTO notifications (user_id, debt_id, from_id, title, body) 
            VALUES (${debt[0].lender_id}, ${debtId}, ${userId}, ${message.title}, ${message.body})
        `;
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

export const markDebtAsPaidService = async (userId, debtId) => {
  try {
    const debt =
      await sql`SELECT d.borrower_id, d.lender_id, d.amount, lender.name, borrower.expo_push_token  FROM "debts" d JOIN "users" borrower ON d.borrower_id = borrower.id JOIN "users" lender ON d.lender_id = lender.id WHERE d.id = ${debtId} AND d.lender_id = ${userId} AND d.status = 'PENDING_CONFIRMATION_BY_LENDER'`;
    if (debt.length === 0) {
      throw new Error("Debt not found or you do not have access to it");
    }
    const message = {
      to: debt[0].expo_push_token,
      title: "Smart Debt - Thông báo xác nhận trả nợ",
      body: `${debt[0].name} xác nhận bạn đã trả khoản nợ ${debt[0].amount} thành công`,
      data: {
        debtId: debtId,
        screen: "wallet",
        receiveId: debt[0].borrower_id,
      },
    };
    await sql`
            UPDATE "debts" 
            SET status = 'PAID' 
            WHERE id = ${debtId}
        `;
    try {
      let tickets = await expo.sendPushNotificationsAsync([message]);
      console.log("Push notification sent:", tickets);
    } catch (pushError) {
      console.warn("Failed to send push notification:", pushError);
      // Don't throw, continue with notification insert
    }
    await sql`
            INSERT INTO notifications (user_id, debt_id, from_id, title, body) 
            VALUES (${debt[0].borrower_id}, ${debtId}, ${userId}, ${message.title}, ${message.body})
        `;
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
