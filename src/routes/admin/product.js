const express = require("express");
const { protect } = require("../../middreware/protect");

const { createProduct } = require("../../controller/admin/product");
const router = express.Router();

router.route("/product").post(createProduct);

module.exports = router;
