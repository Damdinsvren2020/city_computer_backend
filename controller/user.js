const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const paginate = require("../utils/paginate");
const winston = require("winston");
const Wishlist = require("../models/user/wishlist");
function compareAsync(param1, param2) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(param1, param2, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = await user.getJsonWebToken();
  if (token) {
    const newWishList = new Wishlist({
      user: user._id,
    });
    const saved = await newWishList.save();
    if (saved) {
      const finduserAndsetWish = await User.findByIdAndUpdate(user._id, {
        wishlist: saved._id,
      });
    }
  }
  res.json({
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
    {
      id: user._id,
      role: user.role,
    },
    "dijsdhfshfjhsbdjfhbsdjhbfjsdhbjhb"
  );

  if (!ok) {
    throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу", 401);
  }

  res.status(200).json({
    success: true,
    token,
    user: user,
  });
});

exports.saveRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(200)
      .json({ success: false, message: errors.array()[0].msg });
  }
  let data = matchedData(req);
  if (data._ide) {
    await user.updateOne({ _id: data._id }, { ...data }).exec((err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Системд алдаа гарлаа" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Амжилттай хадгалагдлаа Update" });
    });
  } else {
    if (data.password === data.passwordRepeat) {
      const user = User();
      const pass = bcrypt.hashSync();
      user.email = req.body.email;
      user.username = req.body.username;
      user.role = req.body.role;
      user.password = pass;
      user.save((err, sss) => {
        console.log("fefefefefe", sss);
        if (err) {
          winston.error(err);
          return res
            .status(500)
            .json({ success: false, message: "Системд алдаа гарлаа" });
        }
        return res.status(200).json({
          success: true,
          sucmod: true,
          message: "Амжилттай хадгалагдлаа",
        });
      });
    } else {
      return res.json({
        success: false,
        sucmod: true,
        message: "Нууц үг зөрж байна",
      });
    }
  }
};

exports.updateUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, role, password } = req.body;
    const users = await User.findByIdAndUpdate(id);
    console.log(req.params, req.body);
    console.log(users);
    if (username) {
      users.username = username;
    }
    if (email) {
      users.email = email;
    }
    if (password) {
      users.password = password;
    }
    if (role) {
      users.role = role;
    }
    const saveuser = await users.save();
    // console.log(saveuser);
    if (saveuser) {
      res.json({
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});
exports.deleteUsers = async (req, res, next) => {
  try {
    const users = await User.findByIdAndDelete(req.params.id);
    console.log("delete", req.params.id);
    if (!users) {
      throw new MyError(req.params.id + " ID-тэй хэрэглэгч байхгүйээээ.", 400);
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

exports.auth = asyncHandler(async (req, res) => {
  if (!req.headers.authorization) {
    throw new MyError(
      "Энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна. Та эхлээд логин хийнэ үү",
      401
    );
  }
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    throw new MyError("Токен байхгүй байна.", 400);
  }
  // const tokenObj = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const verify = jwt.verify(token, "dijsdhfshfjhsbdjfhbsdjhbfjsdhbjhb");
    const findUser = await User.findById(verify.id).select("-password");
    if (findUser) {
      res.json({
        success: true,
        user: findUser,
        role: findUser.role,
      });
    }
  } catch (err) {
    console.error(err.message, "wtf");
  }
});
