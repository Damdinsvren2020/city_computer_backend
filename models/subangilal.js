const mongoose = require("mongoose");

const SubAngilalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ангилал нэрийг оруулна уу"],
      unique: true,
      trim: true,
      maxlength: [
        250,
        "Ангилал нэрний урт дээд тал нь 250 тэмдэгт байх ёстой.",
      ],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    content: {
      type: String,
      required: [true, "Ангилал тайлбарыг оруулна уу"],
      trim: true,
      maxlength: [
        5000,
        "Ангилал нэрний урт дээд тал нь 20 тэмдэгт байх ёстой.",
      ],
    },
    angilal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Angilal",
      required: true,
    },
    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("SubAngilal", SubAngilalSchema);
