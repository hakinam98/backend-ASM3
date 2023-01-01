const express = require('express');
const router = express.Router();
const authClient = require('../middleware/authclient');

const checkoutController = require('../controllers/checkout');


router.post('/email', authClient, checkoutController.checkout);

module.exports = router