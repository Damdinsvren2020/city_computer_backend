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
    count: brand.length,
  });
});

exports.createBrand = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    console.log("image data", req.body);
    const { thumbnail } = req.files
    const Brand_image = new Brand({
      link: thumbnail[0].path,
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
  try {
    const { id } = req.params;
    // console.log("data uurchluh", req.params);

    const { name, description, newThumbnail, thumbnailOld } = req.body;
    const { thumbnail } = req.files;
    // console.log(newThumbnail, thumbnailOld, thumbnail)
    const banner_images = await Brand.findByIdAndUpdate(id);
    if (name) {
      banner_images.name = name;
    }
    if (newThumbnail) {
      banner_images.link = thumbnail[0].path;
    } else {
      banner_images.link = thumbnailOld;
    }
    if (description) {
      banner_images.description = description;
    }
    const saveBanner_images = await banner_images.save();

    if (saveBanner_images) {
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
