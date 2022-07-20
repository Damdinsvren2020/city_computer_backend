const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    products: [{
        type: mongoose.Types.ObjectId,
        ref: "Product"
    }],
});

module.exports = mongoose.model("cart", cartSchema);
