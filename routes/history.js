const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const historyController = require('../controllers/history');

router.get('/', isAuth, historyController.histories);
router.get('/:orderId', isAuth, historyController.detailHistory);

module.exports = router