import sql from "../config/db.js";

export const getAllContactsService = async (userId) => {
  const result = await sql`SELECT c.*, u.name FROM contacts c JOIN users u ON c.user_id_contact = u.id WHERE c.user_id = ${userId}`;
  return result;
};

export const createContactService = async (userId, userContactId) => {
  try {
    const test =
      await sql`SELECT id FROM contacts WHERE user_id = ${userId} AND user_id_contact = ${userContactId}`;
    if (test.length > 0) {
      return test[0].id;
    } else {
      const result = await sql`
      INSERT INTO contacts (user_id, user_id_contact)
      VALUES (${userId}, ${userContactId})
      RETURNING id;
    `;
      return result[0].id;
    }
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

export const deleteContactService = async (userId, deleteId) => {
  try {
    await sql`DELETE FROM contacts WHERE user_id = ${userId} AND user_id_contact = ${deleteId}`;
    return true;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};
