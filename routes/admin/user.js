const express = require("express");

const {
  register,
  login,
  getUsers,
  saveRegister,
  updateUser,
  deleteUsers,
  auth,
  updateUserFront,
  updateUserFrontPassword,
} = require("../../controller/User");

const { protect } = require("../../middreware/protect");

const { addProduct, removeProduct } = require("../../controller/user/wishList");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);
router.route("/saveregister").post(saveRegister);

router.route("/users").get(getUsers);
router.route("/usersdelete/:id").delete(deleteUsers);

router.route("/usersEdit/:id").put(updateUser);
router.route("/editUserFront/:id").put(updateUserFront);
router.route("/editUserFrontPassword/:id").put(updateUserFrontPassword);

router.route("/customer/wishList").post(addProduct).delete(removeProduct);

router.route("/authorize").get(auth);

module.exports = router;
