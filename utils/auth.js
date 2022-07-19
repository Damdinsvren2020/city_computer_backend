exports = module.exports = {
  admin: function (req, res, next) {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(401).json({ message: "Хандах эрхгүй байна" });
    }
  },
};
