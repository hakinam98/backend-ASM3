const express = require('express');


const authController = require('../controllers/auth');
const authClient = require('../middleware/authclient');

const router = express.Router();

router.get('/signup', authController.signup);

router.get('/login', authController.login);

router.get('/:userId', authClient, authController.getDetailData);

module.exports = router;