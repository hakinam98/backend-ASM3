const express = require('express');
const router = express.Router();
// const isAuth = require('../middleware/is-auth');

const historyController = require('../controllers/history');

// router.get('/', isAuth.AuthLogin, historyController.histories);
// router.get('/:orderId', isAuth.AuthLogin, historyController.detailHistory);

module.exports = router