import mongoose from 'mongoose'
let ObjectId = mongoose.Schema.Types.ObjectId;

let ProductSchema = mongoose.Schema({
    name: String,
    unit: Number,
    price: String,
    desc: String,
    sku: String,
    image: String,
    image2: String,
    images: [String],
    isMongolia: { type: Boolean, default: false },
    category: { type: ObjectId, ref: 'Category' },
    brand: { type: ObjectId, ref: 'Brand' },
    status: { type: String, enum: ['active', 'delete'], default: 'active' },
    isShow: { type: Boolean, default: true },
    slug: { type: String, unique: true },
    created: { type: Date, default: new Date() },
})

module.exports = mongoose.model('Product', ProductSchema);

import { check, validationResult, matchedData } from "express-validator";
import async from "async";
import Product from "../../models/Product";
import winston from "winston";
import auth from '../../utils/auth'

module.exports = function (router) {
    router.get('/getProductList', auth.admin, async (req, res) => {
        const current = parseInt(req.query.current, 10) || 0;
        const pageSize = 30

        async.parallel([
            async function (callback) {
                Product.find({ status: 'active' }).exec((err, result) => {
                    callback(err, result)
                })
            },
            async function (callback) {
                Product.count({ status: 'active' }, (err, result) => {
                    callback(err, result)
                })
            }
        ], (err, results) => {
            if (err) {
                return res.json({ success: false, message: 'Системд алдаа гарлаа' })
            }
            return res.status(200).json({
                success: true,
                products: results[0] || [],
                all: results[1] || 0,
                pageSize,
                current
            })
        });
    })
}
