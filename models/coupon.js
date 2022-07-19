const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const CouponSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        product: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Product"
        },
        offer: {
            type: Number,
        },
        offerCode: {
            type: String,
            required: true
        },
        isValid: {
            type: Boolean,
            default: true,
        },
        validUntill: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        usedUsers: [
            {
                type: mongoose.Types.ObjectId,
                ref: "user"
            }
        ],
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

module.exports = mongoose.model("Coupon", CouponSchema);
