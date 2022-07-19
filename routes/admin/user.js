const express = require("express");

const {
  register,
  login,
  getUsers,
  saveRegister,
} = require("../../controller/User");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);
router.route("/saveregister").post(saveRegister);

router.route("/users").get(getUsers);

module.exports = router;
