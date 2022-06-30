const SubAngilal = require("../../models/subangilal");
const Angilal = require("../../models/angilal");
const MyError = require("../../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../../utils/paginate");

exports.getSubAngilals = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, SubAngilal);

  const subangilal = await SubAngilal.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: subangilal.length,
    data: subangilal,
    pagination,
  });
});

exports.getSubAngilaluud = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, SubAngilal);
  const subangilal = await SubAngilal.find(
    { ...req.query, angilal: req.params.angilalId },
    select
  )
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: subangilal.length,
    data: subangilal,
    pagination,
  });
});

exports.getSubAngilal = asyncHandler(async (req, res, next) => {
  const subangilal = await SubAngilal.findById(req.params.id);

  if (!subangilal) {
    throw new MyError(req.params.id + " ID-тэй ангилал байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: subangilal,
  });
});

exports.createAngilal = asyncHandler(async (req, res, next) => {
  const angilal = await Angilal.create(req.body);

  res.status(200).json({
    success: true,
    data: angilal,
  });
});

exports.createSubAngilal = asyncHandler(async (req, res, next) => {
  const angilal = await Angilal.findById(req.body.category);

  if (!angilal) {
    throw new MyError(req.body.angilal + " ID-тэй ангилал байхгүй!", 400);
  }

  const subangilal = await SubAngilal.create(req.body);

  res.status(200).json({
    success: true,
    data: subangilal,
  });
});

exports.deleteAngilal = asyncHandler(async (req, res, next) => {
  const angilal = await Angilal.findById(req.params.id);

  if (!angilal) {
    throw new MyError(req.params.id + " ID-тэй ангилал байхгүй байна.", 404);
  }

  angilal.remove();

  res.status(200).json({
    success: true,
    data: angilal,
  });
});

exports.updateAngilal = asyncHandler(async (req, res, next) => {
  const angilal = await Angilal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!angilal) {
    throw new MyError(req.params.id + " ID-тэй ангилал байхгүй байна.", 400);
  }

  res.status(200).json({
    success: true,
    data: angilal,
  });
});
