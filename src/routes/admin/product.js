const express = require("express");
const { protect } = require("../../middreware/protect");

const { createProduct, getProducts } = require("../../controller/admin/product");
const router = express.Router();

router.route("/product").post(createProduct).get(getProducts);

module.exports = router;
