const Role = require("../../models/role");
const asyncHandler = require("express-async-handler");
const paginate = require("../../utils/paginate");

exports.createRole = async (req, res, next) => {
  try {
    const { rolename } = req.body;
    const Roles = new Role({
      rolename: rolename,
    });
    const role = await Roles.save();
    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.getRoles = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Role);

  const roles = await Role.find(req.query)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: roles,
    roles,
  });
});
