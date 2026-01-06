import sql from "../config/db.js";
import bcrypt from "bcrypt";
export const getMyProfileService = async (userId) => {
  try {
    const result =
      await sql`SELECT id, name, email, phone, balance, avatar_url FROM users WHERE id = ${userId}`;
    return result;
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};
function valid(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}
function isValidPhoneNumber(phone) {
  if (
    !(
      !phone.includes("  ") &&
      !phone.includes("--") &&
      !phone.includes(" -") &&
      !phone.includes("- ")
    )
  ) {
    return false;
  }
  // Check if phone contains hyphens or spaces
  if (/[\s-]/.test(phone)) {
    // Check if phone starts or ends with a space or hyphen
    if (/^[\s-]|[\s-]$/.test(phone)) {
      return false;
    }
  }
  // Normalize phone number: Remove spaces and hyphens
  phone = phone.replace(/[\s-]/g, "");
  // Check if phone number is exactly 10 digits
  const regex = /^\d{10}$/;
  return regex.test(phone);
}
export const createNewUserService = async (data) => {
  try {
    const { full_name, email, phone, password, avatar_url } = data;
    if (!valid(email)) {
      return {
        status: 400,
        message: "Email không hợp lệ",
      };
    }
    if (!isValidPhoneNumber(phone)) {
      return {
        status: 400,
        message: "Số điện thoại không hợp lệ",
      };
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const password_hash = bcrypt.hashSync(password, salt);

    const result = await sql`
      INSERT INTO Users (
        name,
        email,
        phone,
        password_hash,
        avatar_url
      ) VALUES (${full_name}, ${email}, ${phone}, ${password_hash}, ${avatar_url})
    `;
    return {
      status: 200,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateMyInfoService = async (userId, data) => {
  try {
    const { name, email, phone, balance, avatar_url } = data;
    const result = await sql`
      UPDATE users
      SET name = ${name}, email = ${email}, phone = ${phone}, balance = ${balance}, avatar_url = ${avatar_url}
      WHERE id = ${userId}
    `;
    return {
      status: 200,
      message: "User updated successfully",
    };
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

export const getMyNotificationsService = async (userId) => {
  try {
    const result =
      await sql`SELECT n.*, u.avatar_url FROM "notifications" n JOIN users u ON n.from_id = u.id WHERE n.user_id = ${userId}`;
    return result;
  } catch (error) {
    console.error("Error getting notifications:", error);
    throw error;
  }
};

export const searchUserByPhoneService = async (phone) => {
  try {
    const result =
      await sql`SELECT id, name, avatar_url FROM users WHERE phone LIKE '%' || ${phone} || '%' LIMIT 10`;
    return result;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const updatePushTokenService = async (userId, token) => {
  try {
    const result = await sql`
      UPDATE users
      SET expo_push_token = ${token}
      WHERE id = ${userId}
    `;
    return "Expo push token updated";
  } catch (error) {
    console.error("Error updating push token:", error);
    throw error;
  }
};
