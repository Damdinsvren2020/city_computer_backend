const express = require("express");
const { protect } = require("../../middreware/protect")
const {
  getBanner_images,
  singleBanner,
  createBanner_images,
  deleteBanner_images,
  editBanner_images,
  deleteBanner,
} = require("../../controller/banner_images");
const router = express.Router();

router.route("/bannerimages").get(protect, getBanner_images).post(protect, createBanner_images);
router
  .route("/bannerimages/:id")
  .get(protect, singleBanner)
  .put(protect, editBanner_images)
  .delete(protect, deleteBanner);

router.route("/setBannerImagesStatus").post(protect, deleteBanner_images);

module.exports = router;
