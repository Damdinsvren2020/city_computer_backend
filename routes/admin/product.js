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
  getProductBySubID,
  getProductByBrand,
  getProductByMinMax,
  getProductByAngilal,
  sameProducts,
} = require("../../controller/admin/product");
const router = express.Router();

const { protect } = require("../../middreware/protect");

router.route("/product").post(protect, createProduct).get(getProducts);


router
  .route("/product/:id")
  .get(singleProduct)
  .post(protect, editProduct)
  .delete(protect, removeProduct);
router.route("/productSale/:id").post(protect, saveProductSale);
router.route("/productSub/:id").get(protect, getSingleSub);
router.route("/productAngilal/:id").post(getProductById);

router.route("/productsOfSame/:id").get(sameProducts)


router.route("/productSubAngilal/:id/:angilal").post(getProductBySubID);
router.route("/productBrand/:id/:angilal").post(getProductByBrand);
router.route("/productMinMax/:angilal").post(getProductByMinMax);

router.route("/productChoseAngilal/:id").post(protect, setChosenAngilal);

module.exports = router;
