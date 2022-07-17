const User = require("../models/User");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const paginate = require("../utils/paginate");

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = user.getJsonWebToken();
  res.status(200).json({
    success: true,
    token,
    user: user,
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, User);

  const users = await User.find(req.query)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: users,
    users,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new MyError("Имэйл болон нууц үгээ дамжуулна уу", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу", 401);
  }

  const ok = await user.checkPassword(password);

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );

  if (!ok) {
    throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу", 401);
  }

  res.status(200).json({
    success: true,
    token: token,
    user: user,
  });
});
