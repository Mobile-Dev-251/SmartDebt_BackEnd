import sql from "../config/db.js";

export const createNewGroupService = async (id, data) => {
  try {
    const { name, members } = data;
    
    // Validate that all member IDs exist in users table
    if (members && members.length > 0) {
      const memberIds = members.map(m => parseInt(m)).filter(m => !isNaN(m));
      if (memberIds.length !== members.length) {
        return {
          status: 400,
          message: "Invalid member IDs provided",
        };
      }
      
      const existingUsers = await sql`
        SELECT id FROM users WHERE id = ANY(${memberIds})
      `;
      
      if (existingUsers.length !== memberIds.length) {
        return {
          status: 400,
          message: "Some member IDs do not exist",
        };
      }
    }
    
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
    if (members && members.length > 0) {
      const memberInserts = members.map(memberId => 
        sql`
          INSERT INTO group_members (group_id, user_id)
          VALUES (${groupId}, ${parseInt(memberId)});
        `
      );
      await Promise.all(memberInserts);
    }
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
    const { 
      totalAmount, 
      due_date, 
      description, 
      remind_before, 
      payer_id, 
      involved_members // Frontend gửi xuống danh sách gồm cả Payer
    } = data;

    // --- 1. KIỂM TRA DỮ LIỆU ---
    if (!involved_members || involved_members.length === 0) {
      return { status: 400, message: "Danh sách thành viên không hợp lệ" };
    }

    // --- 2. TẠO KHOẢN CHI CHUNG (GROUP EXPENSE) ---
    // Lưu tổng số tiền vào bảng group_expenses để thống kê lịch sử
    const [expense] = await sql`
      INSERT INTO group_expenses (group_id, payer_id, total_amount, description, created_at)
      VALUES (${groupId}, ${payer_id}, ${totalAmount}, ${description}, NOW())
      RETURNING id
    `;

    // --- 3. TÍNH TOÁN SỐ TIỀN MỖI NGƯỜI (SPLIT) ---
    // Quan trọng: Chia tổng tiền cho TỔNG số thành viên hưởng thụ (bao gồm cả payer)
    const numberOfPeople = involved_members.length;
    const amountPerPerson = Math.floor(totalAmount / numberOfPeople); 

    console.log(`Tổng: ${totalAmount} | Chia cho: ${numberOfPeople} người | Mỗi người: ${amountPerPerson}`);

    // --- 4. TẠO CÁC KHOẢN NỢ CON (DEBTS) ---
    const createdDebts = [];
    
    for (const memberId of involved_members) {
      // Logic: Chỉ tạo nợ cho những người KHÔNG PHẢI là người trả tiền
      // (Convert sang String để so sánh chính xác)
      if (String(memberId) !== String(payer_id)) {
        
        const [debt] = await sql`
          INSERT INTO debts (
            lender_id, 
            borrower_id, 
            type, 
            amount, 
            due_date, 
            remind_before, 
            note, 
            group_expense_id,
            status,
            created_at
          )
          VALUES (
            ${payer_id},          -- Người cho vay (Payer)
            ${memberId},          -- Người nợ
            'NỢ NHÓM',            -- Type
            ${amountPerPerson},   -- SỐ TIỀN ĐÃ CHIA (Không phải totalAmount)
            ${due_date}, 
            COALESCE(${remind_before}, 3), 
            ${description ? `Chi nhóm: ${description}` : 'Chi tiêu nhóm'}, 
            ${expense.id},
            'OPEN',
            NOW()
          )
          RETURNING * `;
        createdDebts.push(debt);
      }
    }

    // --- 5. TRẢ VỀ KẾT QUẢ ---
    return {
      status: 200,
      message: "Tạo chi tiêu nhóm thành công",
      expense_id: expense.id,
      created_debts: createdDebts
    };

  } catch (error) {
    console.error('Error createExpenseForGroupService:', error);
    return { status: 500, message: error.message };
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

    if (!members || !Array.isArray(members) || members.length === 0) {
      return {
        status: 400,
        message: "No members provided",
      };
    }

    // Validate member IDs
    const validMemberIds = members.filter(id => id != null && id !== '').map(id => parseInt(id)).filter(id => !isNaN(id));

    if (validMemberIds.length === 0) {
      return {
        status: 400,
        message: "No valid member IDs provided",
      };
    }

    // Check if members exist in users table
    const existingUsers = await sql`
      SELECT id FROM users WHERE id = ANY(${validMemberIds})
    `;

    if (existingUsers.length !== validMemberIds.length) {
      return {
        status: 400,
        message: "Some member IDs do not exist",
      };
    }

    // Insert members
    const memberInserts = validMemberIds.map(memberId =>
      sql`
        INSERT INTO group_members (group_id, user_id)
        VALUES (${groupId}, ${memberId})
        ON CONFLICT (group_id, user_id) DO NOTHING
      `
    );

    await Promise.all(memberInserts);

    return {
      status: 200,
      message: "Members added to group successfully",
    };
  } catch (error) {
    console.error('Error in addMemberToGroupService:', error);
    return {
      status: 500,
      message: "Error while adding members to group",
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

// services/groupService.js

export const getGroupHistoryExpensesService = async (groupId) => {
  try {
    // Chỉ lấy từ bảng group_expenses (Bảng cha)
    // Join với users để lấy tên người trả tiền (Payer)
    const expenses = await sql`
      SELECT 
        ge.id, 
        ge.total_amount, 
        ge.description, 
        ge.created_at, 
        ge.payer_id,
        u.name as payer_name
      FROM group_expenses ge
      JOIN users u ON ge.payer_id = u.id
      WHERE ge.group_id = ${groupId} 
      ORDER BY ge.created_at DESC
    `;
    
    return {
      status: 200,
      data: expenses // Trả về danh sách các khoản chi tiêu LỚN
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Error while getting group history expenses",
    };
  }
};
