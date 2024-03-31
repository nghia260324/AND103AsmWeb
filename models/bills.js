const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Bills = new Schema({
    id_user: {type: Schema.Types.ObjectId, ref: 'user'}
},{
    timestamps: true
})
module.exports = mongoose.model('bill',Bills);