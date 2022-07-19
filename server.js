const express = require("express");
const env = require("dotenv");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bp = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const bannerRoutes = require("./routes/admin/banner");
const userRoutes = require("./routes/admin/user");
const angilalRoutes = require("./routes/admin/angilal");
const subangilalRoutes = require("./routes/admin/subangilal");
const brandRoutes = require("./routes/admin/brand_router");
const productRoutes = require("./routes/admin/product");
const BannerImagesRoutes = require("./routes/admin/banner_images");
const RoleRoutes = require("./routes/admin/role");
const CouponRoutes = require("./routes/admin/coupon");
env.config();

const imageFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "document") {
      cb(null, "files/docs");
    } else {
      cb(null, "files/images");
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const imageFileFilter = (req, file, cb) => {
  if (file.fieldname === "document") {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-powerpoint" ||
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/ico" ||
      file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
};

mongoose
  .connect(
    "mongodb+srv://admin:admin123@cluster0.i4tip.mongodb.net/citycomputer",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connectod");
  });

app.use(cors());
app.use(bp.json({ extended: true, limit: "10mb" }));
app.use(bp.urlencoded({ extended: true, limit: "10mb" }));
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use("/files", express.static(path.join(__dirname, "files")));
app.use(
  multer({ storage: imageFileStorage, fileFilter: imageFileFilter }).fields([
    { name: "images", maxCount: 10 },
    { name: "avatar", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ])
);

app.use(express.json());
// app.use(fileupload());
// app.use("/api", productCategoryRoutes);
// app.use("/api", product_sub_categoryRoutes);
app.use("/api", userRoutes);
app.use("/api", angilalRoutes);
app.use("/api", subangilalRoutes);
app.use("/api", brandRoutes);
app.use("/api", productRoutes);
app.use("/api", bannerRoutes);
app.use("/api", BannerImagesRoutes);
app.use("/api", RoleRoutes);
app.use("/api", CouponRoutes)

app.get("/data", (req, res, next) => {
  res.status(200).json({
    message: req.body,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
