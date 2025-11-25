import { authLoginService } from "../services/authService.js";

export const handleAuthLogin = async (req, res) => {
  try {
    const data = req.body;
    const result = await authLoginService(data);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error,
    });
  }
};
