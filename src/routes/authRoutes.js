import express from "express";
import {  createNewUser } from "../controllers/userController.js";
import { handleAuthLogin } from "../controllers/authController.js";
const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Auth login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Sai thông tin đăng nhập
 */
router.post("/login", handleAuthLogin);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Auth register
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *                 format: phone
 *               avatar_url:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - full_name
 *               - email
 *               - phone
 *               - password
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       400:
 *         description: Thông tin đăng ký không hợp lệ
 */
router.post("/register", createNewUser);


/**
 * @swagger
 * components:
 *   schemas:
 *     AuthLoginDTO:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthRegisterDTO:
 *       type: object
 *       properties:
 *         full_name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *           format: phone
 *         avatar_url:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - full_name
 *         - email
 *         - phone
 *         - password
 */
export default router;
