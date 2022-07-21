const Product = require("../../models/product");
const SubAngilal = require("../../models/subangilal");
const paginate = require("../../utils/paginate");
const asyncHandler = require("express-async-handler");

exports.getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Product);

  const findProducts = await Product.find(req.query, select)
    .populate("brand")
    .populate("SubID")
    .sort(sort)
    .skip(pagination.start - 1);
  if (findProducts) {
    res.json({
      success: true,
      result: findProducts,
      pagination,
    });
  }
  //   }
});

exports.getProductByAngilal = asyncHandler(async (req, res) => {
  const { id } = req.params
  console.log(id)
  const findProducts = await Product.find({ angilalId: id })
    .populate("brand")
    .populate("SubID")
  if (findProducts) {
    res.json({
      success: true,
      result: findProducts,
    });
  }
})

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  if (id) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort;
    const select = req.query.select;
    ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
    const pagination = await paginate(page, limit, Product);

    const findProducts = await Product.find({ angilalId: id })
      .populate("brand")
      .populate("SubID")
      .sort(sort)
      .skip(pagination.start - 1);
    if (findProducts) {
      return res.json({
        success: true,
        result: findProducts,
        pagination,
      });
    }
  } else {
    const findProducts = await Product.find()
      .populate("brand")
      .populate("SubID");
    if (findProducts) {
      res.json({
        success: true,
        result: findProducts,
        count: findProducts.length,
      });
    }
  }
};

exports.getProductBySubID = asyncHandler(async (req, res) => {
  const { id, angilal } = req.params;
  if (id) {
    const findSub = await SubAngilal.findOne({ _id: id }).populate("product").populate({ path: 'product', populate: { path: 'brand' } })
    if (findSub) {
      return res.json({
        success: true,
        result: findSub.product,
        count: findSub.product.length,
      });
    }
  }
  const findSub = await SubAngilal.findOne({ angilal: angilal }).populate("product").populate({ path: 'product', populate: { path: 'brand' } })
  if (findSub) {
    res.json({
      success: true,
      result: findSub.product,
      count: findSub.product.length,
    });
  }

})
exports.getProductByBrand = asyncHandler(async (req, res) => {
  const { id, angilal } = req.params;
  if (id) {
    console.log(angilal, "brand")
    const findProduct = await Product.find({ brand: id, angilalId: angilal }).populate("brand").populate("SubID");
    if (findProduct) {
      return res.json({
        success: true,
        result: findProduct,
        count: findProduct.length,
      });
    }
  }

  const findProduct = await Product.find({ angilalId: angilal }).populate("brand").populate("SubID");
  if (findProduct) {
    res.json({
      success: true,
      result: findProduct,
      count: findProduct.length,
    });
  }

})

exports.getProductByMinMax = asyncHandler(async (req, res) => {
  const { min, max, angilal } = req.body
  console.log(angilal, "is here")
  const findProduct = await Product.find({ $and: [{ angilalId: angilal }, { price: { $gte: min, $lte: max } }] }).populate("brand").populate("SubID");
  if (findProduct) {
    return res.json({
      success: true,
      result: findProduct,
      count: findProduct.length,
    });
  }
})

exports.getSingleSub = async (req, res) => {
  const { id } = req.params;
  const findSub = await SubAngilal.findById(id).populate("angilal");
  if (findSub) {
    res.json({
      success: true,
      result: findSub,
      count: findSub.length,
    });
  }
};

exports.singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const findSingle = await Product.findById(id)
      .populate("brand")
      .populate("SubID");
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

exports.createProduct = async (req, res, next) => {
  try {
    // console.log(req.body)
    // console.log(req.files)
    const { name, content, brand, SubID, price, quantity, SKU, specs } =
      req.body;
    const { avatar, thumbnail, images } = req.files;

    const newProduct = new Product({
      name: name,
      content: content,
      brand: brand,
      slug: SKU + "/" + name,
      SubID: SubID,
      price: price,
      quantity: quantity,
      SKU: SKU,
      avatar: avatar[0].path,
      thumbnail: thumbnail[0].path,
    });
    const savedProduct = await newProduct.save();
    if (savedProduct) {
      const findAndOtherUpdate = await Product.findById(savedProduct._id);
      if (specs) {
        specs.forEach((item) => {
          findAndOtherUpdate.specs = [
            ...findAndOtherUpdate.specs,
            JSON.parse(item),
          ];
        });
      }
      if (images) {
        images.forEach((image) => {
          findAndOtherUpdate.imagesProduct = [
            ...findAndOtherUpdate.imagesProduct,
            image.path,
          ];
        });
      }
      const saveFinal = await findAndOtherUpdate.save();
      if (saveFinal) {
        const findSubAndAdd = await SubAngilal.findByIdAndUpdate(
          saveFinal.SubID,
          {
            $addToSet: { product: saveFinal._id },
          }
        );
        if (findSubAndAdd) {
          const findProductAndAddAngilal = await Product.findByIdAndUpdate(
            saveFinal._id,
            {
              angilalId: findSubAndAdd.angilal,
            }
          );
          if (findProductAndAddAngilal) {
            res.json({
              success: true,
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      SubID,
      name,
      content,
      brand,
      price,
      quantity,
      SKU,
      specs,
      newAvatar,
      avatarOld,
      newThumbnail,
      thumbnailOld,
      newImages,
      imagesOld,
    } = req.body;
    const { thumbnail, images, avatar } = req.files;
    const product = await Product.findById(id);
    if (SubID) {
      const findProductSub = await Product.findById(id)
      if (findProductSub) {
        const subAndRemoveItem = await SubAngilal.findByIdAndUpdate(findProductSub.SubID, {
          $pull: { product: id }
        })
        if (subAndRemoveItem) {
          const findProduct = await Product.findByIdAndUpdate(id, {
            SubID: null,
            angilalId: null
          })
          if (findProduct) {
            const findAngilal = await SubAngilal.findByIdAndUpdate(SubID, {
              $addToSet: { product: id }
            })
            if (findAngilal) {
              product.SubID = findAngilal._id
              product.angilalId = findAngilal.angilal
            }
          }
        }
      }

    }
    if (name) {
      product.name = name;
    }
    if (content) {
      product.content = content;
    }
    if (brand) {
      product.brand = brand;
    }
    if (price) {
      product.price = price;
    }
    if (quantity) {
      product.quantity = quantity;
    }
    if (SKU) {
      product.SKU = SKU;
    }
    if (newAvatar) {
      product.avatar = avatar[0].path;
    } else {
      product.avatar = avatarOld;
    }
    if (newThumbnail) {
      product.thumbnail = thumbnail[0].path;
    } else {
      product.thumbnail = thumbnailOld;
    }
    if (newImages) {
      product.imagesProduct = [];
      images.forEach((image) => {
        product.imagesProduct = [...product.imagesProduct, image.path];
      });
    } else {
      product.imagesProduct = imagesOld;
    }
    if (specs) {
      product.specs = [];
      specs.forEach((item) => {
        product.specs = [...product.specs, JSON.parse(item)];
      });
    }
    const saveProduct = await product.save();
    if (saveProduct) {
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

exports.setChosenAngilal = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params
    const { SubID } = req.body
    console.log(SubID)
    const findSub = await SubAngilal.findById(SubID)
    const findProduct = await Product.findByIdAndUpdate(id, {
      SubID: findSub._id,
      angilalId: findSub.angilal
    })
    if (findProduct) {
      res.json({
        success: true,
        result: findProduct
      })
    }
  } catch (error) {
    console.log(error)
  }
})
exports.removeProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  console.log(id)
  const findProduct = await Product.findByIdAndRemove(id)
  const findSubAndRemoveProduct = await SubAngilal.findByIdAndUpdate(findProduct.SubID, {
    $pull: { product: findProduct._id }
  })
  if (findSubAndRemoveProduct) {
    res.json({
      success: true,
    })
  }
})

exports.saveProductSale = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { offer } = req.body
  if (offer === 0) {
    const findProduct = await Product.findByIdAndUpdate(id, {
      offer: null
    })
    if (findProduct) {
      return res.json({
        success: true,
      })
    }
  }
  const findProduct = await Product.findByIdAndUpdate(id, {
    offer: offer
  })
  if (findProduct) {
    res.json({
      success: true,
    })
  }
})