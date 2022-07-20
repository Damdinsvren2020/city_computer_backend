const express = require("express");
const router = express.Router();
const { protect } = require("../../middreware/protect");

const {
  getAngilaluud,
  getAngilal,
  getAngilalById,
  createZurag,
  updateAngilal,
  deleteAngilal,
  getSubAngilaluudByID,
  verifyAngilal
} = require("../../controller/admin/angilal");

router.route("/angilal").get(getAngilaluud);
router.route("/angilal/image").post(protect, createZurag);
const { getSubAngilaluud } = require("../../controller/admin/subangilal");

router.route("/:angilalId/sub").get(getSubAngilaluud);
router.route("/Angilal/:id").post(protect, getAngilalById);
router.route("/verifyAngilal/:name").post(verifyAngilal)

router
  .route("/angilal/:id")
  .get(getAngilal)
  .put(protect, updateAngilal)
  .delete(protect, deleteAngilal);
module.exports = router;
