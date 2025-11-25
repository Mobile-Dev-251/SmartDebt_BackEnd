import pool from "../config/db.js";
import bcrypt from "bcrypt";
export const getAllUsersService = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};
export const createNewUserService = async (data) => {
  try {
    const { full_name, email, phone, password, avatar_url } = data;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const password_hash = bcrypt.hashSync(password, salt);
    const query = `
      INSERT INTO Users (
        full_name,
        email,
        phone,
        password_hash,
        avatar_url
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING user_id;
    `;

    const values = [full_name, email, phone, password_hash, avatar_url];
    const result = await pool.query(query, values);
    return result.rows[0].user_id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
