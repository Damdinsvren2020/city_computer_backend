const express = require("express");

const { createRole, getRoles } = require("../../controller/admin/role");

const router = express.Router();

router.route("/role").post(createRole);

router.route("/role").get(getRoles);

module.exports = router;
