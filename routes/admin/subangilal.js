const express = require("express");
const { protect } = require("../../middreware/protect");

const {
  getSubAngilals,
  getSubAngilaluud,
  createSubAngilal,
  deleteAngilal,
  updateAngilal,
} = require("../../controller/admin/subangilal");
const router = express.Router();

router.route("/subangilal").get(getSubAngilals).post(protect, createSubAngilal);

router
  .route("/subangilal/:id")
  .get(protect, getSubAngilaluud)
  .delete(protect, deleteAngilal)
  .put(protect, updateAngilal);

module.exports = router;
