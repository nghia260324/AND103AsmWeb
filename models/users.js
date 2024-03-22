const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const Users = new Scheme({
    email: {type: String, unique: true},
    password: {type: String},
    name: {type: String},
    avatar: {type: String},
},{
    timestamps: true
})
module.exports = mongoose.model('user',Users)