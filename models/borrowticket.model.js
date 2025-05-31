const mongoose = require("mongoose");
const Counter = require("./counter");

const BorrowTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      trim: true,
      unique: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    borrowDate: {
      type: Date,
      required: true,
    },
    allowedDays: {
      type: Number,
      required: true,
      max: [30, "Allowed days must be less than 30"],
    },
    returnDate: {
      type: Date,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ["pending", "borrowed", "expired", "returned"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

BorrowTicketSchema.pre("save", async function (next) {
  if (!this.ticketId) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "ticketId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const paddedNumber = String(counter.seq).padStart(5, "0");
    this.ticketId = `TKBR-${paddedNumber}`;
  }
  next();
});

const BorrowTicket = mongoose.model("BorrowTicket", BorrowTicketSchema);

module.exports = BorrowTicket;
