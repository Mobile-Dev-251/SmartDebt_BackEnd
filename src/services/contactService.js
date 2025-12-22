import sql from "../config/db.js";

export const getAllContactsService = async () => {
    const result = await sql`SELECT * FROM contacts`;
    return result;
};

export const getContactByIdService = async (id) => {
    const result = await sql`SELECT * FROM contacts WHERE id = ${id}`;
    return result[0];
};

export const createContactService = async (data) => {
    try {
        const { name, phone, note } = data;
        const result = await sql`
      INSERT INTO contacts (name, phone, note)
      VALUES (${name}, ${phone}, ${note})
      RETURNING id;
    `;
        return result[0].id;
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