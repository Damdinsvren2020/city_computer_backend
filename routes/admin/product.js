const express = require("express");
const { protect } = require("../../middreware/protect");

const { createProduct, getProducts, singleProduct, getSingleSub, editProduct } = require("../../controller/admin/product");
const router = express.Router();

router.route("/product").post(createProduct).get(getProducts);
router.route("/product/:id").get(singleProduct).post(editProduct);
router.route("/productSub/:id").get(getSingleSub)



module.exports = router;
