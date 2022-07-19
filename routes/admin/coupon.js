const express = require("express");
const { createCoupon, getCoupons, editCoupon, activeValue, removeCoupon } = require("../../controller/admin/coupon");
const { protect } = require("../../middreware/protect")
const router = express.Router();

router.route("/coupon").post(protect, createCoupon).get(protect, getCoupons);
router.route("/coupon/:id").put(protect, editCoupon).delete(protect, removeCoupon);
router.route("/couponValue/:id").post(protect, activeValue);


module.exports = router;
