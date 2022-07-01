const Angilal = require("../../models/angilal");
const MyError = require("../../utils/myError");
const path = require("path");
const util = require("util");
const asyncHandler = require("express-async-handler");
const paginate = require("../../utils/paginate");
const Product = require("../../models/product");
const SubAngilal = require("../../models/subangilal");

// exports.getAngilaluud = asyncHandler(async (req, res, next) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const sort = req.query.sort;
//     const select = req.query.select;

//     ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

//     const pagination = await paginate(page, limit, Angilal);

//     const angilal = await Angilal.find(req.query, select)
//         .sort(sort)
//         .skip(pagination.start - 1)
//         .populate("SubAngilal")
//         .limit(limit);

//     res.status(200).json({
//         success: true,
//         data: angilal,
//         pagination,
//     });
// });

// exports.getAngilal = asyncHandler(async (req, res, next) => {
//     const angilal = await Angilal.findById(req.params.id).populate("SubAngilal");

//     if (!angilal) {
//         throw new MyError(req.params.id + " ID-тэй ангилал байхгүй!", 400);
//     }

//     res.status(200).json({
//         success: true,
//         data: angilal,
//     });
// });

// // exports.createAngilal = asyncHandler(async (req, res, next) => {
// //   const angilal = await Angilal.create(req.body);
// //   res.status(200).json({
// //     success: true,
// //     data: angilal,
// //   });
// // });

// exports.updateAngilal = asyncHandler(async (req, res, next) => {
//     const angilal = await Angilal.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//     });

//     if (!angilal) {
//         throw new MyError(req.params.id + " ID-тэй ангилал байхгүйээээ.", 400);
//     }

//     res.status(200).json({
//         success: true,
//         data: angilal,
//     });
// });

// exports.deleteAngilal = asyncHandler(async (req, res, next) => {
//     const angilal = await Angilal.findById(req.params.id);

//     if (!angilal) {
//         throw new MyError(req.params.id + " ID-тэй ангилал байхгүйээээ.", 400);
//     }

//     angilal.remove();

//     res.status(200).json({
//         success: true,
//         data: angilal,
//     });
// });

exports.createProduct = async (req, res, next) => {
    try {
        console.log(req.body)
        // console.log(req.files)
        const { name, content, brand, SubID, price, quantity, SKU, specs } = req.body;
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
            thumbnail: thumbnail[0].path
        })
        const savedProduct = await newProduct.save()
        if (savedProduct) {
            const findAndOtherUpdate = await Product.findById(savedProduct._id)
            if (specs) {
                specs.forEach(item => {
                    console.log(item)
                    findAndOtherUpdate.specs = [...findAndOtherUpdate.specs, JSON.parse(item)];
                })
            }
            if (images) {
                images.forEach(image => {
                    findAndOtherUpdate.imagesProduct = [...findAndOtherUpdate.imagesProduct, image.path];
                })
            };
            const saveFinal = await findAndOtherUpdate.save()
            if (saveFinal) {
                const findSubAndAdd = await SubAngilal.findByIdAndUpdate(saveFinal.SubID, {
                    $addToSet: { product: saveFinal._id }
                })
                if (findSubAndAdd) {
                    res.json({
                        success: true,
                    })
                }
            }

        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
        })
    }
};
