
const Product = require('../models/product')

exports.Products = async (req, res, next) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.ProductById = async (req, res, next) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        res.status(200).json(product)
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.ProductByCategory = async (req, res, next) => {
    const category = req.query.category;
    try {
        const products = await Product.find({ category: category });
        res.status(200).json(products)
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.ProductPagination = async (req, res, next) => {
    const category = req.query.category;
    const count = req.query.count;
    const page = req.query.page || 1;
    const search = req.query.page;
    try {
        if (category === 'all') {
            const products = await Product.find().skip((page - 1) * count)
                .limit(count)
            res.status(200).json(products)
        }
        else {
            const productsCategory = await Product.find({ category: category }).skip((page - 1) * count)
                .limit(count)
            res.status(200).json(productsCategory)
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}