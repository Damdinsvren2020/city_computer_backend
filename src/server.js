const express = require("express");
const env = require("dotenv");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bp = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bp.json({ extended: true, limit: "10mb" }));
app.use(bp.urlencoded({ extended: true, limit: "10mb" }));
const fileupload = require("express-fileupload");
const bannerRoutes = require("./routes/admin/banner");
const userRoutes = require("./routes/admin/user");
const angilalRoutes = require("./routes/admin/angilal");
const subangilalRoutes = require("./routes/admin/subangilal");
const brandRoutes = require("./routes/admin/brand_router");
env.config();

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

app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use(express.json());
app.use(fileupload());
// app.use("/api", productCategoryRoutes);
// app.use("/api", product_sub_categoryRoutes);
app.use("/api", bannerRoutes);
app.use("/api", userRoutes);
app.use("/api", angilalRoutes);
app.use("/api", subangilalRoutes);
app.use("/api", brandRoutes);
app.get("/data", (req, res, next) => {
  res.status(200).json({
    message: req.body,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
