const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const AngilalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ангилал нэрийг оруулна уу"],
      unique: true,
      trim: true,
      maxlength: [50, "Ангилал нэрний урт дээд тал нь 50 тэмдэгт байх ёстой."],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Ангилал тайлбарыг заавал оруулах ёстой."],
      maxlength: [
        500,
        "Ангилал тайлбарын урт дээд тал нь 500 тэмдэгт байх ёстой.",
      ],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    link: String,
    link: {
      type: String,
    },
    SubAngilal: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubAngilal",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Angilal", AngilalSchema);
