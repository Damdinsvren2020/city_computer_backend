const mongoose = require("mongoose");
let ObjectId = mongoose.Schema.Types.ObjectId;

let BannerSchema = mongoose.Schema({
  link: String,
  image: String,
  created: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Banner", BannerSchema);
