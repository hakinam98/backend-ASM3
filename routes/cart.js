const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const cartController = require('../controllers/cart');


router.post('/', isAuth, cartController.carts)
router.post('/add', isAuth, cartController.addCart)
router.put('/update', isAuth, cartController.updateCart)
router.delete('/delete', isAuth, cartController.deleteCart)

module.exports = router