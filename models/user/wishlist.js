const mongoose = require("mongoose");

const WishListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    products: [{
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: false
    }],
});

module.exports = mongoose.model("wishlist", WishListSchema);
