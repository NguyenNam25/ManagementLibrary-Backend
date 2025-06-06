const agenda = require("./utils/agenda");

// Load các job
require("./jobs/checkLibraryCardExpiry")(agenda);
require("./jobs/deleteOldUsers")(agenda);
require("./jobs/checkBorrowExpiry")(agenda);


// Khi agenda sẵn sàng
agenda.on("ready", async () => {
  console.log("[📅 Agenda] Starting scheduled jobs...");

  await agenda.start();

  // Kiểm tra thẻ hết hạn mỗi ngày lúc 2h sáng
  await agenda.every("0 2 * * *", "check library card expiry");

  //   // Job xử lý thẻ hết hạn hơn 3 ngày
  await agenda.every("0 2 * * *", "delete old users"); // 2h sáng mỗi ngày

  // Kiểm tra mượn hạn hạn mỗi ngày lúc 2h sáng
  await agenda.every("0 2 * * *", "check borrow expiry");
});
