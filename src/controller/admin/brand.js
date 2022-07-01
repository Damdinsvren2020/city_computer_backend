const Brand = require("../../models/brand");
const MyError = require("../../utils/myError");
const path = require("path");
const util = require("util");
const asyncHandler = require("express-async-handler");
const paginate = require("../../utils/paginate");

exports.getBrands = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Brand);

  const brand = await Brand.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: brand,
    pagination,
  });
});

exports.createBrand = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { avatar } = req.files
    const Brand_image = new Brand({
      link: avatar[0].path,
      name: name,
      description: description,
    });
    const brand = await Brand_image.save();
    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!brand) {
    throw new MyError(req.params.id + " ID-тэй брэнд байхгүйээээ.", 400);
  }

  res.status(200).json({
    success: true,
    data: brand,
  });
});

exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    throw new MyError(req.params.id + " ID-тэй брэнд байхгүйээээ.", 400);
  }

  brand.remove();

  res.status(200).json({
    success: true,
    data: brand,
  });
});
