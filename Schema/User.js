var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirth:{
        type: Date,
        default: Date.now,
        required: true
    }
});
var User = mongoose.model('User', UserSchema);
module.exports = User;