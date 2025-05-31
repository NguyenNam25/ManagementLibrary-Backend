const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ReportSchema = new mongoose.Schema(
  {
    cardNumber: {
      type: String,
      required: true,
      trim: true,
    },
    createdate: {
      type: Date,
      required: true,
      trim: true,
    },
    detail: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

ReportSchema.plugin(AutoIncrement, { inc_field: "id" });

const Report = mongoose.model('Report', ReportSchema)

module.exports = Report;