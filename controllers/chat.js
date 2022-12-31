const Chat = require('../models/chat');
const io = require('../socket')
exports.createNewRoom = async (req, res, next) => {
    try {
        const chat = new Chat({
            message: []
        })
        await chat.save();
        res.status(200).json({ _id: chat._id })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addMessage = async (req, res, next) => {
    const roomId = req.body.roomId;
    const newMessage = req.body.message;
    const is_admin = req.body.is_admin;
    try {
        if (roomId) {
            if (newMessage === '==END ROOM==') {
                await Chat.findByIdAndDelete({ _id: roomId })
                io.getIO().emit('end_room')
                res.status(200).json({ message: 'Closed Room!' })
            }
            else {
                const chatRoom = await Chat.findById({ _id: roomId });
                chatRoom.messages.push({ message: newMessage, is_admin: is_admin });
                await Chat.findByIdAndUpdate(roomId, { messages: chatRoom.messages });
                res.status(201).json({ message: 'Send successfully!' })
            }
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getMessageByRoomId = async (req, res, next) => {
    const roomId = req.query.roomId;
    try {
        if (roomId) {
            const chatRoom = await Chat.findById({ _id: roomId });
            if (chatRoom) {
                res.status(200).json({ content: chatRoom.messages })

            }
            else {
                res.status(200).json({ message: "Room Closed!" })
            }
        }
        else {
            res.status(200).json({ message: "Room Closed!" })

        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getRoomId = async (req, res, next) => {
    try {
        const chats = await Chat.find()
        res.status(200).json({ chats: chats })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}