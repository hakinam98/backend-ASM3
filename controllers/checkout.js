const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const Cart = require('../models/cart');
const Order = require('../models/order');

const transport = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENGRED
    }
}))

exports.checkout = async (req, res, next) => {
    const email = req.query.to;
    const fullname = req.query.fullname;
    const idUser = req.query.idUser;
    const phone = req.query.phone;
    const address = req.query.address;
    try {
        const carts = await Cart.find({ idUser: idUser, orderStatus: false }).populate('idProduct')
        console.log(carts)
        if (!carts) {
            const error = new Error('Cart not found.');
            error.statusCode = 404;
            throw error;
        }
        let totalPrice = 0;
        const cartId = [];
        carts.forEach(cart => {
            cartId.push(cart._id.toString())
            return totalPrice += parseInt(cart.idProduct.price) * cart.count
        })
        const order = new Order({
            idUser: idUser,
            cart: cartId,
            fullname: fullname,
            phone: parseInt(phone),
            address: address,
            total: totalPrice,
            delivery: false,
            status: false
        })
        await order.save();
        await Cart.updateMany({ _id: carts }, { orderStatus: true });
        await transport.sendMail({
            to: email,
            from: 'namdnfx17199@funix.edu.vn',
            subject: 'Order Successfully!',
            html: `
            <body style="background:black;color:white" >
              <div style="margin-left: 30px">
                        <h1 style="color: white">Xin Chào ${fullname}</h1>
                        <h3 style="color: white">Phone: ${phone}</h3>
                        <h3 style="color: white">Address: ${address}</h3>
                        <table style="color:white">
                            <thead>
                                <tr>
                                    <th style="border: 1px solid white;text-align: center" scope="col">Tên Sản Phẩm</th>
                                    <th style="border: 1px solid white;text-align: center" scope="col">Hình Ảnh</th>
                                    <th style="border: 1px solid white;text-align: center" scope="col">Giá</th>
                                    <th style="border: 1px solid white;text-align: center" scope="col">Số Lượng</th>
                                    <th style="border: 1px solid white;text-align: center" scope="col">Thành Ttiền</th>
                                </tr>
                            </thead>
                            <tbody>
                            ${carts.map(cart => {
                console.log(cart)
                return (
                    `
                    <tr>
                        <td style="border: 1px solid white;text-align:center">${cart.idProduct.name}</td>
                        <td style="border: 1px solid white;text-align:center"><img src=${cart.idProduct.img1} alt='...' width='70' /></td>
                        <td style="border: 1px solid white;text-align:center">${cart.idProduct.price} VND</td>
                        <td style="border: 1px solid white;text-align:center">${cart.count}</td>
                        <td style="border: 1px solid white;text-align:center">${cart.idProduct.price * cart.count} VND</td>
                    </tr>
                                    `
                )
            })}
                            </tbody>
                            </table>
                            <h1 style="color: white">Tổng Thanh Toán: </h1>
                            <h1 style="color: white">${totalPrice} VND </h1>

                            <h1 style="color: white">Cảm ơn bạn!</h1>        
                    </div>
            `
        }, function (err, res) {
            if (err) {
                console.log(err)
            }
            console.log(res);
        })
        res.status(200).send('Order Successfully!')
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}