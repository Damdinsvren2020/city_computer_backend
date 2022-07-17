const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  rolename: {
    type: String,
    required: [true, "Эрхийн төрлийг оруулна уу"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Role", RoleSchema);
