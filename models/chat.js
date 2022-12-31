const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    messages: {
        type: Array,
        required: true
    },
},
    { timestamps: true }
)

module.exports = mongoose.model('Chat', chatSchema);