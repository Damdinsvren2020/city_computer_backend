const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = async (req, res) => {
  try {
    console.log(req.body)
    if (req.body === {}) return res.json({
      success: false,
      result: "Дахин оролдоно уу!"
    })
    const { firstName, lastName, email, password } = req.body;
    const userExist = await User.findOne({ email: email })
    if (userExist) return res.json({ success: false, result: "Email already registered" })
    if (!userExist) {
      const salt = 10;
      const hash_password = await bcrypt.hash(password, salt);
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        hash_password: hash_password,
        username: shortid.generate(),
      });
      const savedUser = await user.save()
      if (savedUser) {
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;
        return res.json({
          success: true,
          token: token,
          result: "Хэрэглэгч бүртгэглээ",
          user: { _id, firstName, lastName, email, role, fullName },
        });
      }
    }
  } catch (error) {
    if (error) {
      if (error.message === "data and salt arguments required") {
        return console.log(error.message)
      }
      res.json({
        success: false,
        result: "Бүртгэхэд алдаа гарлаа"
      })
    }
  }
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      if (user.authenticate(req.body.password) && user.role === "admin") {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET
        );
        const { _id, firstName, lastName, email, role, fullName } = user;
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      } else {
        return res.status(400).json({
          message: "Нууц үг буруу байна",
        });
      }
    } else {
      return res.status(400).json({ message: "Нэвтрэхэд алдаа гарлаа" });
    }
  });
};

exports.getUser = async (req, res) => {
  try {
    const allUsers = await User.find({ role: "user" })
    if (allUsers) {
      res.status(200).json({
        success: true,
        payload: allUsers
      })
    }
  } catch (error) {
    return res.status(400).json({ message: "алдаа гарлаа" });
  }
}

exports.updateUser = async (req, res) => {
  const { id } = req.params
  const { email, lastName, firstName } = req.body
  try {
    const updatingUser = await User.findByIdAndUpdate(id, {
      firstName: firstName,
      lastName: lastName,
      email: email
    })
    if (updatingUser) {
      res.json({
        success: true,
        result: "Хэрэглэгчийн мэдээлэл засагдсан"
      })
    }
  } catch (error) {
    if (error) {
      res.json({
        success: false,
        result: "Хэрэглэгчийн мэдээлэл засахад алдаа гарсан"
      })
    }
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    const deleteUser = await User.findByIdAndDelete(id)
    if (deleteUser) {
      res.json({
        success: true,
        result: "Deleted"
      })
    }
  } catch (error) {
    if (error) {
      res.json({
        success: false,
        result: "Хэрэглэгчийн мэдээлэл устгахад алдаа гарсан"
      })
    }
  }
}
