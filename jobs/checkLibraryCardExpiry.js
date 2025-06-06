const User = require("../models/user.model");
// const { sendBlockNotification } = require("../utils/mailer");

module.exports = (agenda) => {
  agenda.define("check library card expiry", async (job) => {
    const today = new Date();

    const users = await User.find({
      status: { $ne: "expired" },
      "libraryCard.expirationDate": { $lt: today }
    });

    for (const user of users) {
      user.status = "expired";
      user.expiredAt = new Date();

      await user.save();
    }
  });
};