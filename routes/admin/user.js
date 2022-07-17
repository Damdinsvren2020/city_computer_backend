const express = require("express");

const { register, login, getUsers } = require("../../controller/User");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/users").get(getUsers);

module.exports = router;
