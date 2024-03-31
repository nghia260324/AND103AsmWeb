const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Carts = new Schema({
    id_user: {type: Schema.Types.ObjectId, ref: 'user'},
    id_product: {type: Schema.Types.ObjectId, ref: 'product'},
    quantity: {type: Number},
    isSelected: {type: Boolean},
}, {
    timestamps: true,
})
module.exports = mongoose.model('cart',Carts);