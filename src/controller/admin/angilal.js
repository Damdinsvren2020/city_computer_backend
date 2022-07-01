const Angilal = require("../../models/angilal");
const MyError = require("../../utils/myError");
const path = require("path");
const util = require("util");
const asyncHandler = require("express-async-handler");
const paginate = require("../../utils/paginate");

exports.getAngilaluud = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Angilal);

  const angilal = await Angilal.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .populate("SubAngilal")
    .limit(limit);

  res.status(200).json({
    success: true,
    data: angilal,
    pagination,
  });
});

exports.getAngilal = asyncHandler(async (req, res, next) => {
  const angilal = await Angilal.findById(req.params.id).populate("SubAngilal");

  if (!angilal) {
    throw new MyError(req.params.id + " ID-тэй ангилал байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: angilal,
  });
});

// exports.createAngilal = asyncHandler(async (req, res, next) => {
//   const angilal = await Angilal.create(req.body);
//   res.status(200).json({
//     success: true,
//     data: angilal,
//   });
// });

exports.updateAngilal = asyncHandler(async (req, res, next) => {
  const angilal = await Angilal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!angilal) {
    throw new MyError(req.params.id + " ID-тэй ангилал байхгүйээээ.", 400);
  }

  res.status(200).json({
    success: true,
    data: angilal,
  });
});

exports.deleteAngilal = asyncHandler(async (req, res, next) => {
  const angilal = await Angilal.findById(req.params.id);

  if (!angilal) {
    throw new MyError(req.params.id + " ID-тэй ангилал байхгүйээээ.", 400);
  }

  angilal.remove();

  res.status(200).json({
    success: true,
    data: angilal,
  });
});

exports.createZurag = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { avatar } = req.body
    const angilal_image = new Angilal({
      link: avatar[0].path,
      name: name,
      description: description,
    });
    const angilal = await angilal_image.save();
    res.status(200).json({
      success: true,
      data: angilal,
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};
