const express = require("express");

const {
  register,
  login,
  getUsers,
  saveRegister,
} = require("../../controller/User");

const { addProduct, removeProduct } = require("../../controller/user/wishList");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);
router.route("/saveregister").post(saveRegister);

router.route("/users").get(getUsers);
router.route("/customer/wishList").post(addProduct).delete(removeProduct);


module.exports = router;
