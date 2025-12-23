import sql from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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

    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    return {
      status: 200,
      message: "Đăng nhập thành công!",
      data: {
        user: {
          id: user.id,
          full_name: user.name,
          email: user.email,
          phone: user.phone,
          avatar_url: user.avatar_url,
        },
        accessToken,
        refreshToken,
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
