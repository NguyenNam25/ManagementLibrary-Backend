const mongoose = require("mongoose")

const MajorSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        kind: {
            type: String,
            enum: ['category', 'type'],
            required: true,
        },
        borrowCount: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
)

const Major = mongoose.model("Major", MajorSchema)

module.exports = Major;