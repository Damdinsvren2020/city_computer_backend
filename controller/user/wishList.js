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
    console.log(userID, productID)
    if (findUserWishList.wishlist) {
        // const findWishlist = await Wishlist.findByIdAndUpdate(findUserWishList.wishlist, {
        //     $pop: { products: -1 }
        // })
        // if (findWishlist) {
        //     res.json({
        //         success: true
        //     })
        // }

        Wishlist.find({ user: userID }).forEach(function (doc) {
            Wishlist.updateOne(
                { "_id": doc._id },
                { "$set": { "products": [doc.products] } }
            );
        })

        // const findWishlist = await Wishlist.findById(findUserWishList.wishlist)
        // const saveArray = findWishlist.products
        // const obj = saveArray.reduce((acc, cur, index) => {
        //     if (acc[cur._id] === productID) {
        //         acc[cur._id] = { index: cur }
        //     }
        //     return acc;
        // }, {});
        // const output = Object.values(obj).sort((a, b) => a.index - b.index).map(({ index: val }) => val)
        // console.log(output)
    } else {
        return res.json({
            success: false,
            result: "Хүслийн жагсаалт байхгүй байна!"
        })
    }
})

exports.getUserWishList = asyncHandler(async (req, res) => {
    const { id } = req.params
    console.log(id)
    const findUserWishList = await User.findById(id)
    if (findUserWishList.wishlist) {
        const wishlistProducts = await Wishlist.findById(findUserWishList.wishlist).populate("products").populate({ path: 'products', populate: { path: 'brand' } })

        if (wishlistProducts) {
            res.json({
                success: true,
                result: wishlistProducts
            })
        }
    }
})