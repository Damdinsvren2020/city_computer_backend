const Banner = require("../../models/banner");
const path = require("path");
const util = require("util");
const asyncHandler = require("express-async-handler");
const paginate = require("../../utils/paginate");
exports.createBanner = async (req, res, next) => {
  try {
    const file = req.files.image;
    const fileName = file.name;
    const size = file.data.length;
    const extension = path.extname(fileName);
    if (size > 5000000) throw "File ийн хэмжээ 5mb";
    const md5 = file.md5;
    const URL = __dirname + "/../upload/" + md5 + extension;
    await util.promisify(file.mv)(URL);
    const { thumbnail } = req.files
    const banner = new Banner({
      link: thumbnail[0].path,
    });

    const savedBanner = await banner.save();
    res.status(200).json({
      success: true,
      data: savedBanner,
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.getBanners = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Banner);

  const banners = await Banner.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: banners,
    pagination,
  });
});

exports.deleteBanners = async (req, res, next) => {
  try {
    const banners = await Banner.findByIdAndDelete(req.params.id);

    if (!banners) {
      throw new MyError(req.params.id + " ID-тэй баннер байхгүйээээ.", 400);
    }

    res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (err) {
    next(err);
  }
};
