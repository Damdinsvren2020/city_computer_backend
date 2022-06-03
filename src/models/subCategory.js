const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
