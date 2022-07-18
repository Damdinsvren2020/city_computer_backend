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

exports.getAngilalById = async (req, res, next) => {
  const id = req.params;
  if (id) {
    const findAngilal = await Angilal.find({ productId: id }).populate(
      "Product"
    );
    if (findAngilal) {
      return res.json({
        success: true,
        result: findAngilal,
        count: findAngilal.length,
      });
    }
  } else {
    const findAngilal = await Angilal.find().populate("Product");
    if (findAngilal) {
      return res.json({
        success: true,
        result: findAngilal,
        count: findAngilal.length,
      });
    }
  }
};

exports.updateAngilal = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("data uurchluh", req.params);

    const { name, description, newAvatar, avatarOld } = req.body;
    const { avatar } = req.files;
    console.log(avatar, newAvatar, avatarOld)
    const banner_images = await Angilal.findByIdAndUpdate(id);
    if (name) {
      banner_images.name = name;
    }
    if (newAvatar) {
      banner_images.link = avatar[0].path;
    } else {
      banner_images.link = avatarOld;
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

exports.deleteAngilal = asyncHandler(async (req, res, next) => {
  const angilal = await Angilal.findById(req.params.id);

  if (!angilal) {
    throw new MyError(req.params.id + " ID-тэй ангилал байхгүй байна.", 404);
  }
  if (angilal.SubAngilal.length !== 0) {
    return res.json({
      success: false,
      result: "Энэ ангилалыг устгаж болохгүй!",
      description: "дотор байгаа дэд ангилал болон бараа бүгд устах аюултай"
    })
  } else {
    angilal.remove()
  }
  res.status(200).json({
    success: true,
    data: angilal,
  });
});

exports.createZurag = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { avatar } = req.files;
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
