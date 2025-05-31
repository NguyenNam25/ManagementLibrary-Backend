const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        permissions: [String],
    },
    {
        timestamps: true,
    }
)

const Role = mongoose.model("Role", RoleSchema)

module.exports = Role;