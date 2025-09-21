const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({

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
    resetPasswordOTP: {
        type: Number
    },
    resetPasswordExpires: {
        type: Date
    },

});


const adminmodel = mongoose.model('Admin', adminSchema);

module.exports = adminmodel;

