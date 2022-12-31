const express = require('express');
const chatController = require('../controllers/chat');

const router = express.Router();


router.post('/createNewRoom', chatController.createNewRoom)
router.put('/addMessage', chatController.addMessage)
router.get('/getById', chatController.getMessageByRoomId)
router.get('/getroomid', chatController.getRoomId)

module.exports = router;