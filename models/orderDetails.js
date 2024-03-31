const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderDetails = new Schema({
    id_order: {type: Schema.Types.ObjectId, ref: 'order'},
    id_product: {type: Schema.Types.ObjectId, ref: 'product'},
    quantity: {type: Number}
},{
    timestamps: true
})
module.exports = mongoose.model('orderdetail',OrderDetails);