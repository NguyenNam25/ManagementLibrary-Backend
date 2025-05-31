const mongoose = require("mongoose");
const Counter = require('./counter')

const BookSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      requires: false,
      trim: true,
      default: "",
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Major",
      required: true,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Major",
      required: true,
    },
    publisherName: {
      type: String,
      required: true,
      trim: true,
    },
    yearOfPublication: {
      type: Number,
      required: true,
    },
    language: {
      type: String,
      enum: ["vi", "en", "other"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "borrowed", "unavailable"],
      required: true,
    },
    borrowCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

BookSchema.pre("save", async function (next) {
  if (!this.id) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const paddedNumber = String(counter.seq).padStart(5, "0");
    this.id = `BK-${paddedNumber}`;
  }
  next();
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
