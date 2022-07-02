const express = require("express");
const router = express.Router();
const { protect } = require("../../middreware/protect");
const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../../controller/admin/brand");

router.route("/brand").get(getBrands);
router.route("/brand/image").post(createBrand);

router
  .route("/brand/:id")
  .put(protect, updateBrand)
  .delete(protect, deleteBrand);
module.exports = router;
