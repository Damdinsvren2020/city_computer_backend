const Role = require("../../models/role");
const asyncHandler = require("express-async-handler");
const paginate = require("../../utils/paginate");
const Wishlist = require("../../models/user/wishlist");
const User = require("../../models/User");


exports.addProduct = asyncHandler(async (req, res) => {
    const { userID, productID } = req.body
    const findUserWishList = await User.findById(userID)
    if (findUserWishList.wishlist) {
        const findWishlist = await Wishlist.findByIdAndUpdate(findUserWishList.wishlist, {
            $push: { products: productID }
        })
        if (findWishlist) {
            res.json({
                success: true
            })
        }
    }
    if (!findUserWishList.wishlist) {
        const newWishList = new Wishlist({
            user: userID
        })
        const saved = await newWishList.save()
        if (saved) {
            const finduserAndsetWish = await User.findByIdAndUpdate(userID, {
                wishlist: saved._id
            })
            if (finduserAndsetWish) {
                const findWishlist = await Wishlist.findByIdAndUpdate(findUserWishList.wishlist, {
                    $push: { products: productID }
                })
                if (findWishlist) {
                    res.json({
                        success: true
                    })
                }
            }
        }
    }
})

exports.removeProduct = asyncHandler(async (req, res) => {
    const { userID, productID } = req.body
    const findUserWishList = await User.findById(userID)
    if (findUserWishList.wishlist) {
        const findWishlist = await Wishlist.findByIdAndUpdate(findUserWishList.wishlist, {
            $pull: { products: productID }
        })
        if (findWishlist) {
            res.json({
                success: true
            })
        }
    } else {
        return res.json({
            success: false,
            result: "Хүслийн жагсаалт байхгүй байна!"
        })
    }
})

exports.getUserWishList = asyncHandler(async (req, res) => {
    const { id } = req.params
    const findUserWishList = await User.findById(id)
    if (findUserWishList.wishlist) {
        const wishlistProducts = await Wishlist.findById(findUserWishList.wishlist).populate("products")
        if (wishlistProducts) {
            let totalPrice = 0
            let totalLength = 0
            await wishlistProducts.forEach(async (element) => {
                totalPrice = totalPrice + element.price
            });
        }

    }
    if (!findUserWishList.wishlist) {

    }
})