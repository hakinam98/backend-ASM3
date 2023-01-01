const express = require('express');
const router = express.Router();
const authClient = require('../middleware/authclient');

const cartController = require('../controllers/cart');


router.post('/', authClient, cartController.carts)
router.post('/add', authClient, cartController.addCart)
router.put('/update', authClient, cartController.updateCart)
router.delete('/delete', authClient, cartController.deleteCart)

module.exports = router