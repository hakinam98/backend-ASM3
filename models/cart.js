const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    idProduct: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Cart', cartSchema);