import cron from "node-cron";
import { Expo } from "expo-server-sdk";

let expo = new Expo();

const initReminderWorker = (sql) => {
  cron.schedule("* * * * *", async () => {
    console.log("--- Đang quét các khoản nợ cần nhắc nhở ---");

    try {
      // 1. Truy vấn danh sách nợ đến hạn
      const rows = await sql`
                SELECT d.id, d.amount, u.expo_push_token, lender.name as lender_name, d.borrower_id
                FROM "debts" d
                JOIN "users" u ON d.borrower_id = u.id
                JOIN "users" lender ON d.lender_id = lender.id
                WHERE d.status = 'OPEN' 
                  AND CURRENT_DATE >= (d.due_date - d.remind_before)
                  AND (d.last_reminded IS NULL OR d.last_reminded < CURRENT_DATE)
            `;

      if (rows.length === 0) {
        console.log("Không có khoản nợ nào cần nhắc hôm nay.");
        return;
      }

      let messages = [];
      for (let debt of rows) {
        if (!Expo.isExpoPushToken(debt.expo_push_token)) continue;

        messages.push({
          to: debt.expo_push_token,
          title: "Smart Debt - Nhắc nhở khoản nợ",
          body: `Bạn cần trả ${debt.amount} đồng đã mượn của ${debt.lender_name}`,
          data: {
            debtId: debt.id,
            screen: "wallet",
            receiveId: debt.borrower_id,
          },
        });
      }

      let chunks = expo.chunkPushNotifications(messages);

      for (let chunk of chunks) {
        try {
          let tickets = await expo.sendPushNotificationsAsync(chunk);
          console.log("Phản hồi từ Expo:", tickets);

          for (let msg of chunk) {
            await sql`
                            INSERT INTO notifications (user_id, debt_id, title, body) 
                            VALUES (${msg.data.receiveId}, ${msg.data.debtId}, ${msg.title}, ${msg.body})
                        `;
          }

          const ids = chunk.map((m) => m.data.debtId);
          await sql`
                        UPDATE "debts" 
                        SET last_reminded = CURRENT_DATE 
                        WHERE id = ANY(${ids})
                    `;

          console.log(`Đã xử lý xong một nhóm ${chunk.length} thông báo.`);
        } catch (error) {
          console.error("Lỗi khi xử lý chunk thông báo:", error);
        }
      }
    } catch (dbError) {
      console.error("Lỗi truy vấn cơ sở dữ liệu:", dbError);
    }
  });
};

export default initReminderWorker;
