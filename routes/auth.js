const express = require('express');


const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/signup', authController.signup);

router.get('/login', authController.login);

router.get('/:userId', isAuth, authController.getDetailData);

module.exports = router;