const express = require("express");
const {
  createBanner,
  getBanners,
  deleteBanners,
} = require("../../controller/admin/banner");
const { protect } = require("../../middreware/protect");

const router = express.Router();

router.route("/banner").post(protect, createBanner);
router.get("/banner/getAll", getBanners);

router.route("/bannerDelete/:id").delete(deleteBanners);

module.exports = router;
