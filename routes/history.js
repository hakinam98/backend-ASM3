const express = require('express');
const router = express.Router();
const authClient = require('../middleware/authclient');

const historyController = require('../controllers/history');

router.get('/', authClient, historyController.histories);
router.get('/:orderId', authClient, historyController.detailHistory);

module.exports = router