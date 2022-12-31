const Cart = require('../models/cart');
const Order = require('../models/order')

exports.histories = async (req, res, next) => {
    const idUser = req.query.idUser;
    try {
        const orders = await Order.find({ idUser: idUser })
        res.status(200).json(orders)
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.detailHistory = async (req, res, next) => {
    const orderId = req.params.orderId;
    try {
        const order = await Order.findById(orderId)
        console.log(order)
        const cart = await Cart.find({ _id: order.cart }).populate('idProduct')
        order.cart = cart
        res.status(200).json(order)
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}