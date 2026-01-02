import {
  getMyProfileService,
  createNewUserService,
  updatePushTokenService,
} from "../services/userService.js";
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getMyProfileService(userId);
    return res.status(200).send({ profile });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Cannot get user profile" });
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
