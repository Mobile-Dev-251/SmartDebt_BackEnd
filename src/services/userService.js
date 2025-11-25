import sql from "../config/db.js";
import bcrypt from "bcrypt";
export const getAllUsersService = async () => {
  const result = await sql`SELECT * FROM users`;
  return result;
};
export const createNewUserService = async (data) => {
  try {
    const { full_name, email, phone, password, avatar_url } = data;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const password_hash = bcrypt.hashSync(password, salt);

    const result = await sql`
      INSERT INTO Users (
        full_name,
        email,
        phone,
        password_hash,
        avatar_url
      ) VALUES (${full_name}, ${email}, ${phone}, ${password_hash}, ${avatar_url})
      RETURNING user_id;
    `;
    return result[0].user_id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
