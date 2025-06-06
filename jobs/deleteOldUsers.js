const User = require("../models/user.model");

module.exports = (agenda) => {
  agenda.define("delete old users", async (job) => {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const result = await User.deleteMany({
      status: { $in: ["blocked", "expired"] },
      blockedAt: { $lte: fourteenDaysAgo }
    });

    console.log(`🗑️ Deleted ${result.deletedCount} users (status = blocked or expired > 14 days)`);
  });
};