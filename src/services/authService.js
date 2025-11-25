import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const authLoginService = async (data) => {
  try {
    const { email, password } = data;
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (rows.length === 0) {
      return {
        status: 400,
        message: "Email không tồn tại",
      };
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return {
        status: 400,
        message: "Mật khẩu không đúng!",
      };
    }
    return {
      status: 200,
      message: "Đăng nhập thành công!",
      data: {
        id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
      },
    };
  } catch (error) {
    console.log("Login service error:", error);
    return {
      status: 500,
      message: "Error while log in!",
    };
  }
};
