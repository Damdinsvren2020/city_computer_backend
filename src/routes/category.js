const express = require("express");
const { addCategory, getCategories } = require("../controller/category");
const {
  requireSignin,
  adminMiddleware,
  superAdminMiddleware,
} = require("../common-middleware");
const router = express.Router();

router.post("/category/create", requireSignin, adminMiddleware, addCategory);
router.get("/category/getcategory", getCategories);
router.post("/catergory/addSubCategory");

module.exports = router;
