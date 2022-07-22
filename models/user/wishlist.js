const mongoose = require("mongoose");

const WishListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    products: [
        {
            product: [
                {
                    type: mongoose.Types.ObjectId,
                    ref: "Product",
                    required: false
                }
            ],
            howmany: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
                required: false
            }
        }
    ],
});

module.exports = mongoose.model("wishlist", WishListSchema);
