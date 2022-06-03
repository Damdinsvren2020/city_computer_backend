const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const bp = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bp.json({ extended: true, limit: "10mb" }));
app.use(bp.urlencoded({ extended: true, limit: "10mb" }));

const UserRoutes = require("./routes/user")
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

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


app.use(express.json());
app.use("/api", UserRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

app.get("/data", (req, res, next) => {
  res.status(200).json({
    message: req.body,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
