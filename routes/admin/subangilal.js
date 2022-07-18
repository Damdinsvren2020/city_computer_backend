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

router.route("/subangilal").get(getSubAngilals).post(createSubAngilal);

router
  .route("/subangilal/:id")
  .get(getSubAngilaluud)
  .delete(deleteAngilal)
  .put(updateAngilal);

module.exports = router;
