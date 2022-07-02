const express = require("express");
const { protect } = require("../../middreware/protect");

const { createProduct, getProducts, singleProduct } = require("../../controller/admin/product");
const router = express.Router();

router.route("/product").post(createProduct).get(getProducts);
router.route("/product/:id").get(singleProduct);



module.exports = router;
