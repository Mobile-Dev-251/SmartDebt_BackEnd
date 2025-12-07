import sql from "../config/db.js";

export const getAllExpensesService = async () => {
    const result = await sql`SELECT * FROM expenses`;
    return result;
};

export const getExpenseByIdService = async (id) => {
    const result = await sql`SELECT * FROM expenses WHERE id = ${id}`;
    return result[0];
};

export const createExpenseService = async (data) => {
    try {
        const { category_id, amount, description, date } = data;
        const result = await sql`
      INSERT INTO expenses (category_id, amount, description, date)
      VALUES (${category_id}, ${amount}, ${description}, ${date})
      RETURNING id;
    `;
        return result[0].id;
    } catch (error) {
        console.error("Error creating expense:", error);
        throw error;
    }
};

export const updateExpenseService = async (id, data) => {
    try {
        const { category_id, amount, description, date } = data;
        const result = await sql`
      UPDATE expenses
      SET category_id = ${category_id}, amount = ${amount}, description = ${description}, date = ${date}
      WHERE id = ${id}
      RETURNING *;
    `;
        return result[0];
    } catch (error) {
        console.error("Error updating expense:", error);
        throw error;
    }
};

export const deleteExpenseService = async (id) => {
    try {
        await sql`DELETE FROM expenses WHERE id = ${id}`;
        return true;
    } catch (error) {
        console.error("Error deleting expense:", error);
        throw error;
    }
};