const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cart: {
        type: Array,
        ref: 'Cart',
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    delivery: {
        type: Boolean,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema);