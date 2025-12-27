import sql from "../config/db.js";

export const getAllContactsService = async () => {
  const result = await sql`SELECT * FROM contacts`;
  return result;
};

export const getContactByIdService = async (id) => {
  const result =
    await sql`SELECT phone, email, user_id_contact, note, name FROM contacts WHERE user_id = ${id}`;
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

export const updateContactService = async (id, data) => {
  try {
    const { name, phone, note } = data;
    const result = await sql`
      UPDATE contacts
      SET name = ${name}, phone = ${phone}, note = ${note}
      WHERE id = ${id}
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
};

export const deleteContactService = async (id) => {
  try {
    await sql`DELETE FROM contacts WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};
