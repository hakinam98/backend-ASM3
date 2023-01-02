const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    const userData = req.body;
    try {
        const user = await User.findOne({ email: userData.email })
        if (!user) {
            return res.json({ message: 'Email not exist!' })
        }
        else {
            const isEqual = await bcrypt.compare(userData.password, user.password)
            if (!isEqual) {
                res.json({ message: 'Wrong password!' })
            }
            else {
                if (user.role === 'admin' || user.role === 'staff') {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    await req.session.save()
                    const token = jwt.sign({ email: user.email, userId: user._id.toString() }, 'somesupersecretsecret', { expiresIn: '1h' })
                    res.json({
                        userId: user._id,
                        role: user.role,
                        message: 'Login successfully!',
                        token: token
                    })
                }
                else {
                    return res.json({ message: 'You are not Admin or Staff!' })
                }
            }
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getInfoUser = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            users: users,
            usersCount: users.length
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.getInforOrder = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('cart')
        let earnings = 0;
        orders.forEach(order => {
            return earnings += order.total;
        })
        res.status(200).json({
            orders: orders.sort((a, b) => b.createdAt - a.createdAt),
            ordersNum: orders.length,
            earnings: earnings,
            balance: Number((earnings / 12).toFixed())
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}
exports.getInforProduct = async (req, res, next) => {

    try {
        const products = await Product.find()
        res.status(200).json({
            products: products
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addProduct = async (req, res, next) => {
    console.log(req.files)
    if (!req.files) {
        res.status(422).json({ message: 'No image provided.' })
        // const error = new Error('No image provided.');
        // error.statusCode = 422;
        // throw error
    }
    const name = req.body.name;
    const category = req.body.category;
    const price = req.body.price;
    const shortDesc = req.body.shortDesc;
    const longDesc = req.body.longDesc;
    let images = [];
    req.files.forEach(file => {
        return images.push(file.path.replace("\\", "/"))
    })
    const product = new Product({
        name: name,
        category: category,
        price: price,
        short_desc: shortDesc,
        long_desc: longDesc,
        img1: 'https://backend-asm3-kappa.vercel.app' + images[0],
        img2: 'https://backend-asm3-kappa.vercel.app' + images[1],
        img3: 'https://backend-asm3-kappa.vercel.app' + images[2],
        img4: 'https://backend-asm3-kappa.vercel.app' + images[3],
    })
    try {
        await product.save();
        res.status(201).json({
            message: 'Product created!',
            product: product
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateProduct = async (req, res, next) => {
    const updateProduct = req.body;
    console.log(updateProduct)
    try {
        await Product.findByIdAndUpdate(updateProduct._id, {
            name: updateProduct.name,
            category: updateProduct.category,
            price: updateProduct.price,
            short_desc: updateProduct.shortDesc,
            long_desc: updateProduct.longDesc
        })
        res.status(201).json({ message: 'Product updated!' })

    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteProduct = async (req, res, next) => {
    const productId = req.params.productId;
    console.log(productId)
    try {
        await Product.findByIdAndDelete(productId)
        res.status(200).json({ message: 'Product deleted!' })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}