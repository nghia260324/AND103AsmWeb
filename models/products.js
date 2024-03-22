const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const Products = new Scheme({
    name:{type: String},
    quantity: {type: Number},
    price: {type: Number},
    status: {type: Number},
    thumbnail: {type: String},
    description: {type: String},
    id_category: {type: Scheme.Types.ObjectId, ref: 'category'},
    id_distributor: {type: Scheme.Types.ObjectId, ref: 'distributor'},
},{
    timestamps: true
})
module.exports = mongoose.model('product',Products)