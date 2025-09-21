const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },

    userCategory: {
        type: String,
        enum: ['AI/ML','Data science', 'Web development', 'Programming language', 'DSA'],
        required: true  
    }

});

const usermodel = mongoose.model('User', userSchema);

module.exports = usermodel


