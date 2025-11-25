import sql from "../config/db.js";
import bcrypt from "bcrypt";

export const authLoginService = async (data) => {
  try {
    const { email, password } = data;
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (result.length === 0) {
      return {
        status: 400,
        message: "Email không tồn tại",
      };
    }
    const user = result[0];
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
