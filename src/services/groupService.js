import sql from "../config/db.js";

export const createNewGroupService = async (id, data) => {
  try {
    const { name, members } = data;
    const result = await sql`
            INSERT INTO groups (name, created_by)
            VALUES (${name}, ${id})
            RETURNING id;
        `;
    const groupId = result[0].id;
    await sql`
                INSERT INTO group_members (group_id, user_id)
                VALUES (${groupId}, ${id});
            `;
    members.map(async (memberId) => {
      await sql`
                INSERT INTO group_members (group_id, user_id)
                VALUES (${groupId}, ${memberId});
            `;
    });
    return {
      status: 201,
      message: "Group created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 400,
      message: "Error creating group",
    };
  }
};

export const createExpenseForGroupService = async (userId, groupId, data) => {
  try {
    const { totalAmount, due_date, description, remind_before, exceptMembers } =
      data;
    const members =
      await sql`SELECT user_id FROM group_members WHERE group_id = ${groupId}`;
    const splitAmount =
      exceptMembers.length !== 0
        ? totalAmount / (members.length - exceptMembers.length)
        : totalAmount / members.length;
    const [expense] = await sql`
                INSERT INTO group_expenses (group_id, payer_id, total_amount, description)
                VALUES (${groupId}, ${userId}, ${totalAmount}, ${description})
                RETURNING id
            `;
    // 3. Tạo các khoản nợ cá nhân cho từng thành viên (trừ người trả tiền)
    for (let member of members) {
      if (exceptMembers.length !== 0) {
        if (
          member.user_id !== userId &&
          !exceptMembers.includes(member.user_id)
        ) {
          await sql`
                            INSERT INTO debts (lender_id, borrower_id, type, amount, due_date, remind_before, note, group_expense_id)
                            VALUES (${userId}, ${member.user_id}, 'NỢ NHÓM', ${splitAmount}, ${due_date}, COALESCE(${remind_before}, 3), ${description}, ${expense.id})
                        `;
        }
      } else if (member.user_id !== userId) {
        await sql`
                        INSERT INTO debts (lender_id, borrower_id, type, amount, due_date, remind_before, note, group_expense_id)
                        VALUES (${userId}, ${member.user_id}, 'NỢ NHÓM', ${splitAmount}, ${due_date}, COALESCE(${remind_before}, 3), ${description}, ${expense.id})
                    `;
      }
    }

    return {
      status: 200,
      message: "Group expense created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Error while creating group expense",
    };
  }
};

export const getMyGroupsService = async (id) => {
  try {
    const groups = await sql`
            SELECT g.id, g.name, g.created_by, g.created_at FROM groups g
            JOIN group_members gm ON g.id = gm.group_id
            WHERE gm.user_id = ${id};`;
    return {
      status: 200,
      data: groups,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 400,
      message: "Error while getting groups",
    };
  }
};

export const getGroupMembersService = async (groupId) => {
  try {
    const members = await sql`
            SELECT u.id, u.name, u.email, u.avatar_url
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = ${groupId};
        `;
    return {
      status: 200,
      data: members,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 400,
      message: "Error while accessing group members",
    };
  }
};

export const addMemberToGroupService = async (groupId, data) => {
  try {
    const { members } = data;
    members.map(async (memberId) => {
      await sql`
                INSERT INTO group_members (group_id, user_id)
                VALUES (${groupId}, ${memberId});
            `;
    });
    return {
      status: 200,
      message: "Member added to group successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Error while adding member to group",
    };
  }
};

export const leaveGroupService = async (userId, groupId) => {
  try {
    await sql`
      DELETE FROM group_members
      WHERE group_id = ${groupId} AND user_id = ${userId};
    `;
    return {
      status: 200,
      message: "Left group successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 400,
      message: "Error while leaving group",
    };
  }
};

export const getGroupHistoryExpensesService = async (groupId) => {
  try {
    const expenses =
      await sql`SELECT ge.id, ge.payer_id, ge.total_amount, ge.description, ge.created_at FROM group_expenses ge WHERE ge.group_id = ${groupId} ORDER BY ge.created_at DESC`;
    return expenses;
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Error while getting group history expenses",
    };
  }
};
