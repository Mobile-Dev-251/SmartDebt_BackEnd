import cron from "node-cron";
import { Expo } from "expo-server-sdk";

let expo = new Expo();

const initReminderWorker = (sql) => {
  cron.schedule(
    "* * * * *",
    async () => {
      console.log("--- Đang quét các khoản nợ cần nhắc nhở ---");

      try {
        // 1. Truy vấn danh sách nợ đến hạn (sử dụng timezone Việt Nam)
        const rows = await sql`
                SELECT d.id, d.amount, borrower.expo_push_token, lender.id as lender_id, lender.name as lender_name, lender.expo_push_token as lender_push_token, borrower.id as borrower_id, borrower.name as borrower_name
                FROM "debts" d
                JOIN "users" lender ON d.lender_id = lender.id
                JOIN "users" borrower ON d.borrower_id = borrower.id
                WHERE d.status = 'OPEN' 
                  AND CURRENT_DATE AT TIME ZONE 'Asia/Ho_Chi_Minh' >= (d.due_date - d.remind_before)
                  AND (d.last_reminded IS NULL OR d.last_reminded < CURRENT_DATE AT TIME ZONE 'Asia/Ho_Chi_Minh')
            `;

        if (rows.length === 0) {
          console.log("Không có khoản nợ nào cần nhắc hôm nay.");
          return;
        }

        let messages = [];
        let notifications = [];

        for (let debt of rows) {
          // Tạo thông báo cho borrower (người nợ)
          if (Expo.isExpoPushToken(debt.expo_push_token)) {
            messages.push({
              to: debt.expo_push_token,
              title: "Smart Debt - Nhắc nhở khoản nợ",
              body: `Bạn cần trả ${debt.amount} đồng đã mượn của ${debt.lender_name}`,
              data: {
                debtId: debt.id,
                lenderId: debt.lender_id,
                screen: "wallet",
                receiveId: debt.borrower_id,
                type: "debt_reminder_borrower"
              },
            });
          }

          // Tạo thông báo cho lender (người cho vay) - để họ biết borrower cần trả
          if (Expo.isExpoPushToken(debt.lender_push_token)) {
            messages.push({
              to: debt.lender_push_token,
              title: "Smart Debt - Nhắc nhở khoản nợ",
              body: `${debt.borrower_name} cần trả bạn ${debt.amount} đồng`,
              data: {
                debtId: debt.id,
                borrowerId: debt.borrower_id,
                screen: "wallet",
                receiveId: debt.lender_id,
                type: "debt_reminder_lender"
              },
            });
          }

          // Lưu notifications vào database cho cả borrower và lender
          notifications.push({
            user_id: debt.borrower_id,
            debt_id: debt.id,
            from_id: debt.lender_id,
            title: "Smart Debt - Nhắc nhở khoản nợ",
            body: `Bạn cần trả ${debt.amount} đồng đã mượn của ${debt.lender_name}`,
            type: "REMINDER"
          });

          notifications.push({
            user_id: debt.lender_id,
            debt_id: debt.id,
            from_id: debt.borrower_id,
            title: "Smart Debt - Nhắc nhở khoản nợ",
            body: `${debt.borrower_name} cần trả bạn ${debt.amount} đồng`,
            type: "REMINDER"
          });
        }

        // Gửi push notifications
        let chunks = expo.chunkPushNotifications(messages);
        for (let chunk of chunks) {
          try {
            let tickets = await expo.sendPushNotificationsAsync(chunk);
            console.log("Phản hồi từ Expo:", tickets);
          } catch (error) {
            console.error("Lỗi khi gửi push notifications:", error);
          }
        }

        // Lưu notifications vào database
        for (let notification of notifications) {
          try {
            await sql`
              INSERT INTO notifications (user_id, debt_id, from_id, title, body, type) 
              VALUES (${notification.user_id}, ${notification.debt_id}, ${notification.from_id}, ${notification.title}, ${notification.body}, ${notification.type})
            `;
          } catch (error) {
            console.error("Lỗi khi lưu notification:", error);
          }
        }

        // Cập nhật last_reminded (sử dụng timezone Việt Nam)
        const ids = rows.map((debt) => debt.id);
        await sql`
          UPDATE "debts" 
          SET last_reminded = CURRENT_DATE AT TIME ZONE 'Asia/Ho_Chi_Minh'
          WHERE id = ANY(${ids})
        `;

        console.log(`Đã xử lý xong ${rows.length} khoản nợ, tạo ${notifications.length} thông báo.`);
      } catch (dbError) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", dbError);
      }
    },
    {
      timezone: "Asia/Ho_Chi_Minh",
    }
  );
};

export default initReminderWorker;
