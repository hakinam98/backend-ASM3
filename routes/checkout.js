const express = require('express');
const router = express.Router();
// const isAuth = require('../middleware/is-auth');

const checkoutController = require('../controllers/checkout');


// router.post('/email', isAuth.AuthLogin, checkoutController.checkout);

module.exports = router