const Coupon = require("../../models/coupon");
const asyncHandler = require("express-async-handler");
const paginate = require("../../utils/paginate");


exports.createCoupon = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { name, description, offer, date, productID, offerCode } = req.body
    const newCoupon = new Coupon({
        name: name,
        description: description,
        product: productID,
        validUntill: date,
        offer: offer,
        offerCode: offerCode,
    })
    const savedCoupon = await newCoupon.save()
    if (savedCoupon) {
        res.json({
            success: true,
            title: savedCoupon.name + " is now active",
            result: "Coupon is saved and access code is " + savedCoupon.offerCode
        })
    }
})

exports.getCoupons = asyncHandler(async (req, res) => {
    const allCoupons = await Coupon.find().populate("product")
    if (allCoupons) {
        res.json({
            success: true,
            result: allCoupons
        })
    }
})

exports.editCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name, description, offer, date, productID, offerCode } = req.body
    const coupon = await Coupon.findById(id)
    if (name) {
        coupon.name = name
    }
    if (description) {
        coupon.description = description
    }
    if (offer) {
        coupon.offer = offer
    }
    if (name) {
        coupon.name = name
    }

    if (date) {
        coupon.date = date
    }
    if (productID) {
        coupon.product = productID
    }
    if (offerCode) {
        coupon.offerCode = offerCode
    }
    const editSaved = await coupon.save()
    if (editSaved) {
        res.json({
            success: true,
            title: editSaved.name + " is now active",
            result: "Coupon is saved and access code is " + editSaved.offerCode
        })
    }
})

exports.activeValue = asyncHandler(async (req, res) => {
    const { id } = req.params
    const coupon = await Coupon.findById(id)
    if (coupon.isActive) {
        coupon.isActive = false
    } else {
        coupon.isActive = true
    }
    const saved = await coupon.save()
    if (saved) {
        res.json({
            success: true,
        })
    }
})

exports.removeCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    const removeCoupon = await Coupon.findByIdAndDelete(id)
    if (removeCoupon) {
        res.json({
            success: true,
        })
    }
})


