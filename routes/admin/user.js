const express = require("express");

const {
  register,
  login,
  getUsers,
  saveRegister,
  updateUser,
  deleteUsers,
} = require("../../controller/User");

const { addProduct, removeProduct } = require("../../controller/user/wishList");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);
router.route("/saveregister").post(saveRegister);

router.route("/users").get(getUsers);
router.route("/usersdelete/:id").delete(deleteUsers);

router.route("/usersEdit/:id").put(updateUser);
router.route("/customer/wishList").post(addProduct).delete(removeProduct);

module.exports = router;
