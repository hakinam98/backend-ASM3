const express = require('express');
const router = express.Router();
// const isAuth = require('../middleware/is-auth');

const cartController = require('../controllers/cart');


// router.post('/', isAuth.AuthLogin, cartController.carts)
// router.post('/add', isAuth.AuthLogin, cartController.addCart)
// router.put('/update', isAuth.AuthLogin, cartController.updateCart)
// router.delete('/delete', isAuth.AuthLogin, cartController.deleteCart)

module.exports = router