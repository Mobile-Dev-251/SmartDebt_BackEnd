import {
  getAllUsersService,
  createNewUserService,
} from "../services/userService.js";
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    return res.send(users);
  } catch (error) {
    console.error(error);
  }
};

export const createNewUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await createNewUserService(data);
    return res.status(result.status).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error,
    });
  }
};
