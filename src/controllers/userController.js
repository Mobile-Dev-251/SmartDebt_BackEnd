import {
  getAllUsersService,
  createNewUserService,
  updatePushTokenService,
} from "../services/userService.js";
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    return res.send({
      authorizeId: req.user.id,
      users: users,
    });
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

export const updatePushToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const token = req.body.token;
    // Call service to update push token
    const result = await updatePushTokenService(userId, token);
    return res.status(201).json({
      message: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error,
    });
  }
};