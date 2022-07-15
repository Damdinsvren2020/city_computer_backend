const mongoose = require("mongoose");
let ObjectId = mongoose.Schema.Types.ObjectId;

let Banner_imagesSchema = mongoose.Schema({
  link: String,
  name: String,
  thumbnail: String,
  orders: Number,
  type: String,
  status: { type: String, enum: ["active", "delete"], default: "active" },
  created: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Banner_images", Banner_imagesSchema);
