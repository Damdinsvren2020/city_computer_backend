const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const Banner_images = require("../models/banner_images");
const { async } = require("async");

exports.getBanner_images = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Banner_images);

  const findBanner_images = await Banner_images.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1);
  if (findBanner_images) {
    res.json({
      success: true,
      result: findBanner_images,
      pagination,
    });
  }
});

exports.singleBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const findSingle = await Banner_images.findById(id);
    if (findSingle) {
      res.json({
        success: true,
        result: findSingle,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const findSingle = await Banner_images.findByIdAndRemove(id);
    if (findSingle) {
      res.json({
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.createBanner_images = async (req, res, next) => {
  try {
    const { name, link, orders } = req.body;
    const { thumbnail } = req.files;

    const newBanner_images = new Banner_images({
      name: name,
      link: link,
      orders: orders,
      thumbnail: thumbnail[0].path,
    });
    newBanner_images.save(async (err, ss) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: `Системд алдаа гарлаа ${err}` });
      }
      return res.status(200).json({
        success: true,
        sucmod: true,
        message: "Амжилттай хадгалагдлаа",
        data: ss,
        new: true,
      });
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
};

exports.editBanner_images = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("data uurchluh", req.params);

    const { name, orders, newThumbnail, thumbnailOld } = req.body;
    const { thumbnail } = req.files;
    const banner_images = await Banner_images.findByIdAndUpdate(id);
    if (name) {
      banner_images.name = name;
    }
    if (newThumbnail) {
      banner_images.thumbnail = thumbnail[0].path;
    } else {
      banner_images.thumbnail = thumbnailOld;
    }
    if (orders) {
      banner_images.orders = orders;
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
};

exports.deleteBanner_images = async (req, res, next) => {
  await Banner_images.updateOne(
    { _id: req.body._id },
    { status: "delete" }
  ).exec(async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Системд алдаа гарлаа" });
    }
    const doc = await Banner_images.findOne({
      _id: req.body._id,
      status: "delete",
    });
    return res.status(200).json({
      success: true,
      sucmod: true,
      message: "Амжилттай устгалаа",
      data: doc,
    });
  });
};
