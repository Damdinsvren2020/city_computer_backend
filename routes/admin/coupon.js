const express = require("express");
const { createCoupon, getCoupons, editCoupon, activeValue, removeCoupon } = require("../../controller/admin/coupon");

const router = express.Router();

router.route("/coupon").post(createCoupon).get(getCoupons);
router.route("/coupon/:id").put(editCoupon).delete(removeCoupon);
router.route("/couponValue/:id").post(activeValue);


module.exports = router;
