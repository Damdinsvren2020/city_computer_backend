const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Брэнд нэрийг оруулна уу"],
      unique: true,
      trim: true,
      maxlength: [50, "Брэнд нэрний урт дээд тал нь 50 тэмдэгт байх ёстой."],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Брэнд тайлбарыг заавал оруулах ёстой."],
      maxlength: [
        500,
        "Брэнд тайлбарын урт дээд тал нь 500 тэмдэгт байх ёстой.",
      ],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    link: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Brand", BrandSchema);
