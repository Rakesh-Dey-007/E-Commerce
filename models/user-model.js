const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true,
    },
    email: String,
    password: String,
    cart: {
        type: Array,
        default: []
    },
    orders: {
        type: Array,
        default: []
    },
    username: String,
    mobile: Number,
    profileImage: String,
    address: String,
    age: Number,
});


module.exports = mongoose.model('user', userSchema);