import {
  getMyProfileService,
  updateMyInfoService,
  createNewUserService,
  updatePushTokenService,
  getMyNotificationsService,
  searchUserByPhoneService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
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

export const updateMyInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    await updateMyInfoService(userId, data);
    return res.status(200).send("Successfully updated user info");
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.detail });
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
      error: error.detail,
    });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await getMyNotificationsService(userId);
    return res.status(200).send(notifications);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Cannot get user notifications" });
  }
};

export const searchUserByPhone = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { phone } = req.query;
    if (!phone || phone.trim() === "") {
      return res.status(400).json({
        message: "Thiếu số điện thoại để tìm kiếm",
      });
    }
    const user = await searchUserByPhoneService(phone);
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.detail });
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

export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    // Gọi service
    const result = await markNotificationAsReadService(userId, notificationId);
    
    return res.status(result.status).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    // Gọi service
    const result = await markAllNotificationsAsReadService(userId);
    
    return res.status(result.status).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
};