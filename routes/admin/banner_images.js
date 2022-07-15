const express = require("express");

const {
  getBanner_images,
  singleBanner,
  createBanner_images,
  deleteBanner_images,
  editBanner_images,
  deleteBanner,
} = require("../../controller/banner_images");
const router = express.Router();

router.route("/bannerimages").get(getBanner_images).post(createBanner_images);
router
  .route("/bannerimages/:id")
  .get(singleBanner)
  .put(editBanner_images)
  .delete(deleteBanner);

router.route("/setBannerImagesStatus").post(deleteBanner_images);

module.exports = router;
