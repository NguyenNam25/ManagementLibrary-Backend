const BorrowTicket = require("../models/borrowticket.model");

module.exports = (agenda) => {
  agenda.define("check borrow expiry", async (job) => {
    const today = new Date();

    const borrows = await BorrowTicket.find({
      expiredDate: { $lt: today }
    });

    for (const borrow of borrows) {
      borrow.status = "expired";
      await borrow.save();
    }
  });
};
