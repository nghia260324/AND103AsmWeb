const mongoose = require('mongoose');
mongoose.set('strictQuery',true);

const local = 'mongodb://localhost:27017/AND103_Assignment';
const connect = async () => {
    try {
        await mongoose.connect(local, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Connect succes!');
    } catch(err) {
        console.log(err);
    }
}
module.exports = {connect};
