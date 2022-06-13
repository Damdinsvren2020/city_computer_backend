const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        error: "Хэрэглэгч бүртгэлтэй байна",
      });

    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: Math.random().toString(),
      role: "admin",
    });

    _user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      if (user) {
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;
        return res.status(201).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      }
    });
  });
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email: email });
    if (!userExist)
      return res.status(400).json({
        message: "Email not found",
      });
    if (userExist) {
      if (userExist.role !== "admin")
        return res.status(400).json({
          message: "Access Denied",
        });
      const matched = await bcrypt.compare(password, userExist.hash_password);
      if (!matched)
        return res.status(400).json({
          message: "Invalid password",
        });
      const token = jwt.sign({ _id: userExist._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.status(200).json({
        token: token,
        user: {
          _id: userExist._id,
          firstName: userExist.firstName,
          lastName: userExist.lastName,
          email: userExist.email,
          role: userExist.role,
          fullName: userExist.fullName,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// exports.signin = (req, res) => {
//   User.findOne({ email: req.body.email }).exec((error, user) => {
//     if (error) return res.status(400).json({ error });
//     if (user) {
//       if (user.authenticate(req.body.password) && user.role === "admin") {
//         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//           expiresIn: "1h",
//         });
//         const { _id, firstName, lastName, email, role, fullName } = user;
//         console.log(firstName)
//         res.status(200).json({
//           token,
//           user: {
//             _id,
//             firstName,
//             lastName,
//             email,
//             role,
//             fullName,
//           },
//         });
//       } else {
//         return res.status(400).json({
//           message: "Invalid password",
//         });
//       }
//     } else {
//       return res.status(400).json({ message: "Something with wrong" });
//     }
//   });
// };

exports.requiredSignin = (req, res, next) => {
  const token = req.headers.authorization.split("")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  req.user = user;
  console.log(token);
  next();
};
