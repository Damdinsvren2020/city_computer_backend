const { check, validationResult } = require("express-validator");

exports.validateSignupRequest = [
  check("firstName").notEmpty().withMessage("Та нэр ээ оруулна уу"),
  check("lastName").notEmpty().withMessage("Таны овог"),
  check("lastName"),
  check("email").isEmail().withMessage("Email хаяг аа оруулна уу"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Нууц үг хамгийн багадаа 6 тэмдэгт байна."),
];

exports.validateSigninRequest = [
  check("email").isEmail().withMessage("Email хаяг аа оруулна уу"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Нууц үг хамгийн багадаа 6 тэмдэгт байна."),
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};
