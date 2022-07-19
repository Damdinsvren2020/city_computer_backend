const express = require("express");
// const { protect } = require("../../middreware/protect");

const {
  createProduct,
  getProducts,
  singleProduct,
  getSingleSub,
  editProduct,
  getProductById,
  setChosenAngilal,
  removeProduct,
  saveProductSale,
} = require("../../controller/admin/product");
const router = express.Router();

router.route("/product").post(createProduct).get(getProducts);
router.route("/product/:id").get(singleProduct).post(editProduct).delete(removeProduct);
router.route("/productSale/:id").post(saveProductSale)
router.route("/productSub/:id").get(getSingleSub);
router.route("/productAngilal/:id").post(getProductById);
router.route("/productChoseAngilal/:id").post(setChosenAngilal)

module.exports = router;
