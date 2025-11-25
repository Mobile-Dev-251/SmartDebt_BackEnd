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
    console.log("Data request ", req.body);
    const result = await createNewUserService(data);
    return res.status(200).json({
      user_id: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error,
    });
  }
};
