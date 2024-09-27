const mongoose = require("mongoose");
const ROLES = require("../constants/roles");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: [ROLES.admin, ROLES.author, ROLES.reader], default: ROLES.reader}
}, {
    versionKey: false
})

module.exports =  mongoose.model("user", userSchema)