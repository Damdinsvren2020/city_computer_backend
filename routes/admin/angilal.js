const express = require("express");
const router = express.Router();
const { protect } = require("../../middreware/protect");

const {
  getAngilaluud,
  getAngilal,
  // createAngilal,
  createZurag,
  updateAngilal,
  deleteAngilal,
} = require("../../controller/admin/angilal");

router.route("/angilal").get(getAngilaluud);
router.route("/angilal/image").post(createZurag);
const { getSubAngilaluud } = require("../../controller/admin/subangilal");

router.route("/:angilalId/sub").get(getSubAngilaluud);

router
  .route("/angilal/:id")
  .get(getAngilal)
  .put(protect, updateAngilal)
  .delete(protect, deleteAngilal);
module.exports = router;
