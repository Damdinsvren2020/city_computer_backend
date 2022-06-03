const express = require("express");
const { adminMiddleware } = require("../common-middleware");
const router = express.Router();
const { signup, signin, getUser, updateUser, deleteUser } = require("../controller/user");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../validators/auth");

router.post("/signupUser", signup);
router.post("/signinUser", validateSigninRequest, isRequestValidated, signin);
router.get("/getUsers", getUser);
router.post("/updateUser/:id", updateUser)
router.delete("/deleteUser/:id", deleteUser)

// router.post("/profile", requiredSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });

module.exports = router;
