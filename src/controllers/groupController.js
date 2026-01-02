import e from "express";
import {
  createNewGroupService,
  getGroupMembersService,
  getMyGroupsService,
  createExpenseForGroupService,
  addMemberToGroupService,
  getGroupHistoryExpensesService,
  leaveGroupService,
} from "../services/groupService.js";

export const createNewGroup = async (req, res) => {
  try {
    const data = req.body;
    const id = req.user.id;
    const result = await createNewGroupService(id, data);
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

export const createExpenseInGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const data = req.body;
    const result = await createExpenseForGroupService(userId, groupId, data);
    return res.status(result.status).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error,
    });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const id = req.user.id;
    const result = await getMyGroupsService(id);
    if (result.status === 200)
      return res.status(result.status).json(result.data);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error,
    });
  }
};

export const groupMembers = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const result = await getGroupMembersService(groupId);
    if (result.status === 200) {
      return res.status(result.status).json(result.data);
    } else {
      return res.status(result.status).json({
        message: result.message,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error,
    });
  }
};

export const addMemberToGroup = async (req, res) => {
  try {
    const data = req.body;
    const groupId = req.params.groupId;
    const result = await addMemberToGroupService(groupId, data);
    if (result.status === 200) {
      return res.status(result.status).json({
        message: result.message,
      });
    } else {
      return res.status(result.status).json({
        message: result.message,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error,
    });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    // Call service to leave group
    const result = await leaveGroupService(userId, groupId);
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

export const groupHistoryExpenses = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    // Call service to get group history expenses
    const result = await getGroupHistoryExpensesService(groupId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error,
    });
  }
};
