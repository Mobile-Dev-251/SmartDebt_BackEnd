// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  
  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "Bạn chưa đăng nhập! (Missing Token)",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 403,
        message: "Token không hợp lệ hoặc đã hết hạn!",
      });
    }

    req.user = user;
    
    next();
  });
};